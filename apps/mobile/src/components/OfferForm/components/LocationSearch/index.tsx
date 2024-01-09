import {type LocationSuggestion} from '@vexl-next/rest-api/src/services/location/contracts'
import {
  useAtomValue,
  useSetAtom,
  type Atom,
  type PrimitiveAtom,
  type WritableAtom,
} from 'jotai'
import React, {useEffect, useRef, useState} from 'react'
import {Modal, Platform, type TextInput} from 'react-native'
import {useDebounceValue} from 'tamagui'
import {
  getCurrentLocale,
  useTranslation,
} from '../../../../utils/localization/I18nProvider'
import IconButton from '../../../IconButton'
import Input from '../../../Input'
import Screen from '../../../Screen'
import ScreenTitle from '../../../ScreenTitle'
import closeSvg from '../../../images/closeSvg'
import magnifyingGlass from '../../../images/magnifyingGlass'
import LocationsList from './LocationsList'

interface Props {
  setOfferLocationActionAtom: WritableAtom<
    null,
    [locationSuggestionAtom: Atom<LocationSuggestion>],
    void
  >
  updateAndRefreshLocationSuggestionsActionAtom: WritableAtom<
    null,
    [request: {phrase: string; lang: string}],
    Promise<void>
  >
  locationSuggestionsAtom: PrimitiveAtom<LocationSuggestion[]>
  locationSuggestionsAtomsAtom: Atom<Array<Atom<LocationSuggestion>>>
  onClosePress: () => void
  visible: boolean
}

function LocationSearch({
  setOfferLocationActionAtom,
  updateAndRefreshLocationSuggestionsActionAtom,
  locationSuggestionsAtom,
  locationSuggestionsAtomsAtom,
  onClosePress,
  visible,
}: Props): JSX.Element {
  const {t} = useTranslation()
  const inputRef = useRef<TextInput>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const debouncedSearchValue = useDebounceValue(inputValue, 1000)
  const updateAndRefreshLocationSuggestions = useSetAtom(
    updateAndRefreshLocationSuggestionsActionAtom
  )
  const setLocationSuggestions = useSetAtom(locationSuggestionsAtom)
  const locationSuggestionsAtoms = useAtomValue(locationSuggestionsAtomsAtom)

  function onInputValueChange(value: string): void {
    if (value === '') setLocationSuggestions([])
    setInputValue(value)
  }

  useEffect(() => {
    if (debouncedSearchValue.length > 0) {
      void updateAndRefreshLocationSuggestions({
        phrase: debouncedSearchValue,
        lang: getCurrentLocale(),
      })
    }

    return () => {
      setLocationSuggestions([])
    }
  }, [
    debouncedSearchValue,
    updateAndRefreshLocationSuggestions,
    setLocationSuggestions,
  ])

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClosePress}
      onShow={() => {
        if (Platform.OS === 'android') {
          setTimeout(() => {
            inputRef.current?.blur()
            inputRef.current?.focus()
          }, 100)
        }
      }}
    >
      <Screen customHorizontalPadding={16}>
        <ScreenTitle text={''}>
          <IconButton variant="dark" icon={closeSvg} onPress={onClosePress} />
        </ScreenTitle>
        <Input
          ref={inputRef}
          autoFocus={Platform.OS === 'ios'}
          value={inputValue}
          onChangeText={onInputValueChange}
          textColor="$greyOnBlack"
          icon={magnifyingGlass}
          variant="greyOnBlack"
          placeholder={t('offerForm.location.addCityOrDistrict')}
          showClearButton={!!inputValue}
          onClearPress={() => {
            setInputValue('')
            setLocationSuggestions([])
          }}
        />
        <LocationsList
          setOfferLocationActionAtom={setOfferLocationActionAtom}
          locationSuggestionsAtom={locationSuggestionsAtom}
          locationSuggestionsAtoms={locationSuggestionsAtoms}
          onClose={onClosePress}
        />
      </Screen>
    </Modal>
  )
}

export default LocationSearch
