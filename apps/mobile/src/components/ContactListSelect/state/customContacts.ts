import {z} from 'zod'
import {useSetAtom} from 'jotai'
import {ContactNormalized} from '../brands/ContactNormalized.brand'
import {atomWithParsedMmkvStorage} from '../../../utils/atomWithParsedMmkvStorage'

export const customContactsAtom = atomWithParsedMmkvStorage(
  'customContacts',
  [],
  z.array(ContactNormalized)
)

export function useAddCustomContact(): (
  customContact: ContactNormalized
) => void {
  const setCustomContacts = useSetAtom(customContactsAtom)

  return (contact: ContactNormalized) => {
    setCustomContacts((old) => [contact, ...old])
  }
}