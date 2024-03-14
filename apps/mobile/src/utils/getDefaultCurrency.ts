import {parsePhoneNumber} from 'awesome-phonenumber'
import {getDefaultStore} from 'jotai'
import {type CurrencyInfo} from '../../../../packages/domain/src/general/currency.brand'
import {sessionDataOrDummyAtom} from '../state/session'
import {currencies} from './localization/currency'

function getDefaultCurrency(): CurrencyInfo {
  const userPhoneNumber = getDefaultStore().get(
    sessionDataOrDummyAtom
  ).phoneNumber
  const parsedPhoneNumber = parsePhoneNumber(userPhoneNumber)
  const defaultCurrency = Object.values(currencies).find((currency) =>
    parsedPhoneNumber.countryCode
      ? currency.countryCode.includes(parsedPhoneNumber.countryCode)
      : currencies.USD
  )

  return defaultCurrency ?? currencies.USD
}

export default getDefaultCurrency
