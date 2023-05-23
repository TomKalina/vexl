import {createScope, molecule} from 'jotai-molecules'
import {
  ContactNormalized,
  type ContactNormalizedWithHash,
} from '../../state/contacts/domain'
import {type Atom, atom, type SetStateAction, type WritableAtom} from 'jotai'
import {matchSorter} from 'match-sorter'
import {contactsFromDeviceAtom} from './state/contactsFromDeviceAtom'
import {toE164PhoneNumber} from '@vexl-next/domain/dist/general/E164PhoneNumber.brand'
import getValueFromSetStateActionOfAtom from '../../utils/atomUtils/getValueFromSetStateActionOfAtom'
import {pipe} from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import {safeParse} from '../../utils/fpUtils'
import {splitAtom} from 'jotai/utils'
import {hmacSign} from '@vexl-next/resources-utils/dist/utils/crypto'
import {privateApiAtom} from '../../api'
import {Alert} from 'react-native'
import {toCommonErrorMessage} from '../../utils/useCommonErrorMessages'
import {translationAtom} from '../../utils/localization/I18nProvider'
import reportError from '../../utils/reportError'
import {loadingOverlayDisplayedAtom} from '../LoadingOverlayProvider'
import {importedContactsAtom} from '../../state/contacts'
import notEmpty from '../../utils/notEmpty'
import {updateAllOffersConnectionsActionAtom} from '../../state/connections/atom/offerToConnectionsAtom'
import {deduplicateBy} from '../../utils/deduplicate'

export const ContactsSelectScope = createScope<ContactNormalized[]>([])

export const contactSelectMolecule = molecule((getMolecule, getScope) => {
  const searchTextAtom = atom('')
  const importedContacts = getScope(ContactsSelectScope)

  const selectedNumbersAtom = atom(
    new Set(importedContacts.map((one) => one.normalizedNumber))
  )

  const customContactsAtom = atom(
    importedContacts.filter((one) => !one.fromContactList)
  )

  const allContactsAtom = atom((get) => {
    const contactsFromDevice = get(contactsFromDeviceAtom)
    return deduplicateBy(
      [...contactsFromDevice, ...importedContacts],
      (one) => one.normalizedNumber
    )
  })

  const contactsToDisplayAtom = atom((get) => {
    const searchText = get(searchTextAtom)
    const allContacts = get(allContactsAtom)

    return matchSorter(allContacts, searchText, {
      keys: ['name', 'numberToDisplay'],
    })
  })
  const contactsToDisplayAtomsAtom = splitAtom(contactsToDisplayAtom)

  const selectAllAtom = atom(
    (get) => {
      const selectedNumbers = get(selectedNumbersAtom)
      const contactsToDisplay = get(contactsToDisplayAtom)
      return !contactsToDisplay.some(
        (one) => !selectedNumbers.has(one.normalizedNumber)
      )
    },
    (get, set, update: SetStateAction<boolean>) => {
      const contactsToDisplay = get(contactsToDisplayAtom)
      const shouldSelectAll = getValueFromSetStateActionOfAtom(update)(() =>
        get(selectAllAtom)
      )
      set(selectedNumbersAtom, (value) => {
        const newValue = new Set(value)
        contactsToDisplay
          .map((one) => one.normalizedNumber)
          .forEach(shouldSelectAll ? newValue.add : newValue.delete, newValue)

        return newValue
      })
    }
  )

  function createSelectContactAtom(
    contactAtom: Atom<ContactNormalized>
  ): WritableAtom<boolean, [SetStateAction<boolean>], void> {
    return atom(
      (get) => get(selectedNumbersAtom).has(get(contactAtom).normalizedNumber),
      (get, set, number: SetStateAction<boolean>) => {
        const contactNumber = get(contactAtom).normalizedNumber
        const selected = getValueFromSetStateActionOfAtom(number)(() =>
          get(selectedNumbersAtom).has(contactNumber)
        )

        set(selectedNumbersAtom, (value) => {
          const newValue = new Set(value)
          if (selected) newValue.add(contactNumber)
          else newValue.delete(contactNumber)
          return newValue
        })
      }
    )
  }

  const searchTextAsCustomContactAtom = atom((get) => {
    const searchText = get(searchTextAtom)

    return pipe(
      searchText,
      toE164PhoneNumber,
      O.chain((e164) =>
        O.fromEither(
          safeParse(ContactNormalized)({
            normalizedNumber: e164,
            numberToDisplay: searchText,
            name: searchText,
            fromContactList: false,
          })
        )
      )
    )
  })

  const addAndSelectContactAtom = atom(
    null,
    (get, set, contact: ContactNormalized) => {
      set(customContactsAtom, (val) => [...val, contact])
      set(selectedNumbersAtom, (val) => {
        const newVal = new Set(val)
        newVal.add(contact.normalizedNumber)
        return newVal
      })
      set(searchTextAtom, '')
    }
  )

  const submitActionAtom = atom(null, (get, set): T.Task<boolean> => {
    const contactApi = get(privateApiAtom).contact
    const {t} = get(translationAtom)

    const selectedNumbers = Array.from(get(selectedNumbersAtom))
    const allContacts = get(allContactsAtom)
    set(loadingOverlayDisplayedAtom, true)
    return pipe(
      selectedNumbers,
      A.map((oneNumber) =>
        allContacts.find(
          (oneContact) => oneContact.normalizedNumber === oneNumber
        )
      ),
      A.filter(notEmpty),
      A.map((oneContact) => {
        return pipe(
          hmacSign('VexlVexl')(oneContact.normalizedNumber),
          E.map((hash): ContactNormalizedWithHash => ({...oneContact, hash}))
        )
      }),
      E.sequenceArray,
      TE.fromEither,
      TE.chainFirstW((contacts) =>
        contactApi.importContacts({contacts: contacts.map((one) => one.hash)})
      ),
      TE.match(
        (e) => {
          if (e._tag !== 'NetworkError') {
            reportError('error', 'error while submitting contacts', e)
          }

          Alert.alert(toCommonErrorMessage(e, t) ?? t('common.unknownError'))
          return false
        },
        (importedContacts) => {
          set(importedContactsAtom, [...importedContacts])
          void set(updateAllOffersConnectionsActionAtom)()
          return true
        }
      ),
      T.map((v) => {
        set(loadingOverlayDisplayedAtom, false)
        return v
      })
    )
  })

  return {
    selectAllAtom,
    contactsToDisplayAtom,
    contactsToDisplayAtomsAtom,
    searchTextAtom,
    customContactsAtom,
    createSelectContactAtom,
    searchTextAsCustomContactAtom,
    addAndSelectContactAtom,
    submitActionAtom,
  }
})