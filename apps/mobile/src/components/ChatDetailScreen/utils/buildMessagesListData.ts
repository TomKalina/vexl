import {flow, pipe} from 'fp-ts/lib/function'
import {type ChatMessageWithState} from '../../../state/chat/domain'
import {type TradeChecklistInState} from '../../../state/tradeChecklist/domain'
import {
  UnixMilliseconds,
  UnixMilliseconds0,
} from '@vexl-next/domain/dist/utility/UnixMilliseconds.brand'
import {
  type VexlBotOrMessageWithState,
  addVexlBotOrMessageWithStateToArray,
  getMessageTime,
  getUniqueKey,
} from './VexlBotMessageOrMessageWithState'
import {DateTime} from 'luxon'
import * as A from 'fp-ts/Array'
import {type MessagesListItem} from '../components/MessageItem'

function addVexlBotMessagesToMessagesListData(
  tradeChecklist: TradeChecklistInState
): (args: ChatMessageWithState[]) => VexlBotOrMessageWithState[] {
  return flow(
    A.map(
      (message): VexlBotOrMessageWithState => ({
        type: 'message',
        message,
      })
    ),
    (a) => {
      const dateAndTimeInteraction = UnixMilliseconds.parse(
        Math.max(
          tradeChecklist.dateAndTime.sent?.timestamp ?? 0,
          tradeChecklist.dateAndTime.received?.timestamp ?? 0
        )
      )

      if (dateAndTimeInteraction === 0) return a
      const messageToInsert: VexlBotOrMessageWithState = {
        type: 'vexlBot',
        message: {
          type: 'dateAndTimePreview' as const,
          date: dateAndTimeInteraction,
        },
      }

      return addVexlBotOrMessageWithStateToArray(messageToInsert)(a)
    },
    (a) => {
      const networkInteraction = UnixMilliseconds.parse(
        Math.max(
          tradeChecklist.network.sent?.timestamp ?? 0,
          tradeChecklist.network.received?.timestamp ?? 0
        )
      )

      if (networkInteraction === 0) return a
      const messageToInsert: VexlBotOrMessageWithState = {
        type: 'vexlBot',
        message: {
          type: 'networkPreview' as const,
          date: networkInteraction,
        },
      }

      return addVexlBotOrMessageWithStateToArray(messageToInsert)(a)
    }
  )
}

function messagesToListData(
  messages: VexlBotOrMessageWithState[]
): MessagesListItem[] {
  const result = [] as MessagesListItem[]

  let prevMessageTime: DateTime | null = null

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (!message) continue
    const messageTime = DateTime.fromMillis(getMessageTime(message))
    if (
      prevMessageTime &&
      prevMessageTime.diff(messageTime, 'minutes').minutes > 10
    ) {
      result.push({
        type: 'time',
        time: prevMessageTime,
        key: `time-${getUniqueKey(message)}`,
      })
      prevMessageTime = messageTime
    } else if (
      prevMessageTime &&
      prevMessageTime.diff(messageTime, 'minutes').minutes > 1
    ) {
      result.push({
        type: 'space',
        key: `space-${getUniqueKey(message)}`,
      })
    }
    prevMessageTime = messageTime

    if (message.type === 'message')
      result.push({
        type: 'message',
        time: messageTime,
        message: message.message,
        isLatest: i === messages.length - 1,
        key: `message-${getUniqueKey(message)}`,
      })
    else {
      result.push({
        type: 'vexlBot',
        key: `vexlBot-${getUniqueKey(message)}`,
        data: message.message,
      })
    }
  }

  const vexlBotTradingChecklistMessage: MessagesListItem = {
    type: 'vexlBot',
    key: 'vexlBot-tradeChecklistReminder',
    data: {
      type: 'tradeChecklistSuggestion',
      date: UnixMilliseconds0,
    },
  }

  // Vexl bot should be displayed after the first message
  if (result.length < 2) return [...result, vexlBotTradingChecklistMessage]
  return [
    ...result.slice(0, -1),
    vexlBotTradingChecklistMessage,
    ...result.slice(-1),
  ]
}

export default function buildMessagesListData(
  messages: ChatMessageWithState[],
  tradeChecklist: TradeChecklistInState
): MessagesListItem[] {
  return pipe(
    messages,
    addVexlBotMessagesToMessagesListData(tradeChecklist),
    messagesToListData
  )
}