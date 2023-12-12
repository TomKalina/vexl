import {I18n} from 'i18n-js'
import * as translations from './localization/translations'

export function getNewI18n(language: string): I18n {
  const newI18n = new I18n(translations)
  newI18n.locale = language
  newI18n.defaultLocale = 'en'
  newI18n.enableFallback = true
  return newI18n
}
