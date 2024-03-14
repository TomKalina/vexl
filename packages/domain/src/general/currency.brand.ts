import {z} from 'zod'
export const CurrencyCode = z.enum([
  'AED',
  'AUD',
  'BGN',
  'BRL',
  'CAD',
  'CHF',
  'CLP',
  'CNY',
  'CZK',
  'DKK',
  'EUR',
  'GBP',
  'HKD',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'JPY',
  'KRW',
  'MXN',
  'NOK',
  'NZD',
  'PLN',
  // 'RON',
  // 'RSD',
  'RUB',
  'SAR',
  'SEK',
  'SGD',
  'THB',
  'TRY',
  'UAH',
  'USD',
  'ZAR',
  'COP',
  'TZS',
])

export const CurrencyInfo = z.object({
  code: CurrencyCode,
  flag: z.string().brand<'CurrencyFlag'>(),
  name: z.string().brand<'CurrencyName'>(),
  symbol: z.string().brand<'CurrencySymbol'>(),
  maxAmount: z.number(),
  position: z.enum(['before', 'after']),
  countryCode: z.array(z.number()),
})

export type CurrencyCode = z.TypeOf<typeof CurrencyCode>
export type CurrencyInfo = z.TypeOf<typeof CurrencyInfo>
