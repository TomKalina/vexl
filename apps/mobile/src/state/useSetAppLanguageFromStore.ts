import {useAtomValue, useSetAtom} from 'jotai'
import {preferencesAtom} from '../utils/preferences'
import {i18nAtom} from '../utils/localization/I18nProvider'
import {useEffect} from 'react'
import {getNewI18n} from '../utils/getNewI18n'

export function useSetAppLanguageFromStore(): void {
  const preferences = useAtomValue(preferencesAtom)
  const setI18n = useSetAtom(i18nAtom)

  useEffect(() => {
    if (preferences?.appLanguage) {
      setI18n(getNewI18n(preferences.appLanguage))
    }
  }, [preferences.appLanguage, setI18n])
}
