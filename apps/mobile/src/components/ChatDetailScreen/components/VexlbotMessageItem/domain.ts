import {type UnixMilliseconds} from '@vexl-next/domain/dist/utility/UnixMilliseconds.brand'

export interface TradingChecklistSuggestion {
  type: 'tradeChecklistSuggestion'
  date: UnixMilliseconds
}

export interface TradingChecklistDateAndTimePreview {
  type: 'dateAndTimePreview'
  date: UnixMilliseconds
}

export interface TradingChecklistNetworkPreview {
  type: 'networkPreview'
  date: UnixMilliseconds
}

// TODO more trading messages

export type VexlBotMessageData =
  | TradingChecklistSuggestion
  | TradingChecklistDateAndTimePreview
  | TradingChecklistNetworkPreview
