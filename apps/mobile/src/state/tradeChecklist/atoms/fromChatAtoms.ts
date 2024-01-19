import {type OneOfferInState} from '@vexl-next/domain/src/general/offers'
import type {SetStateAction} from 'jotai'
import {atom} from 'jotai'
import {focusAtom} from 'jotai-optics'
import focusChatWithMessagesAtom from '../../../state/chat/atoms/focusChatWithMessagesAtom'
import type {FocusAtomType} from '../../../utils/atomUtils/FocusAtomType'
import valueOrDefaultAtom from '../../../utils/atomUtils/valueOrDefaultAtom'
import {getOtherSideData} from '../../chat/atoms/selectOtherSideDataAtom'
import type {ChatIds, ChatWithMessages} from '../../chat/domain'
import {dummyChatWithMessages} from '../../chat/domain'
import {offerForChatOriginAtom} from '../../marketplace/atoms/offersState'

export const parentChatAtomAtom = atom<FocusAtomType<ChatWithMessages>>(
  atom(dummyChatWithMessages)
)

export const chatWithMessagesAtom = atom(
  (get) => get(get(parentChatAtomAtom)),
  (get, set, update: SetStateAction<ChatWithMessages>) => {
    const chatWithMessagesAtom = get(parentChatAtomAtom)
    set(chatWithMessagesAtom, update)
  }
)

export const tradeChecklistDataAtom = focusAtom(chatWithMessagesAtom, (p) =>
  p.prop('tradeChecklist')
)

export const tradeChecklistDateAndTimeDataAtom = atom(
  (get) => get(tradeChecklistDataAtom).dateAndTime
)
export const tradeChecklistLocationDataAtom = atom(
  (get) => get(tradeChecklistDataAtom).location
)
export const tradeChecklistAmountDataAtom = atom(
  (get) => get(tradeChecklistDataAtom).amount
)
export const tradeChecklistNetworkDataAtom = atom(
  (get) => get(tradeChecklistDataAtom).network
)
export const tradeChecklistIdentityDataAtom = atom(
  (get) => get(tradeChecklistDataAtom).identity
)
export const tradeChecklistContactDataAtom = atom(
  (get) => get(tradeChecklistDataAtom).contact
)

export const identityRevealedAtom = atom((get) => {
  const tradeChecklistData = get(tradeChecklistDataAtom)
  const identityRevealedOldWay = get(chatWithMessagesAtom).messages.some(
    (one) => one.message.messageType === 'APPROVE_REVEAL'
  )

  return (
    tradeChecklistData.identity.sent?.status === 'APPROVE_REVEAL' ||
    tradeChecklistData.identity.received?.status === 'APPROVE_REVEAL' ||
    identityRevealedOldWay
  )
})

const chatOriginAtom = focusAtom(chatWithMessagesAtom, (p) =>
  p.prop('chat').prop('origin')
)
export const originOfferAtom = atom<OneOfferInState | undefined>((get) => {
  const chatOrigin = get(chatOriginAtom)
  // TODO is is ok to create an atom here?
  //  It might not be a problem since we would have to find the value anyway
  //  Better to check
  return get(offerForChatOriginAtom(chatOrigin))
})

export const originOfferCurrencyAtom = atom((get) => {
  const originOffer = get(originOfferAtom)

  return originOffer?.offerInfo?.publicPart?.currency
})

export const otherSideDataAtom = atom((get) => {
  const chatData = get(chatWithMessagesAtom)
  return getOtherSideData(chatData.chat)
})

export const identityRevealTriggeredFromChatAtom = atom((get) => {
  const chatWithMessages = get(chatWithMessagesAtom)
  const identityRevealMessage = chatWithMessages.messages.find(
    (one) =>
      one.message.messageType === 'DISAPPROVE_REVEAL' ||
      one.message.messageType === 'APPROVE_REVEAL' ||
      one.message.messageType === 'REQUEST_REVEAL'
  )

  return !!identityRevealMessage
})

export const contactRevealTriggeredFromChatAtom = atom((get) => {
  const chatWithMessages = get(chatWithMessagesAtom)
  const contactRevealMessage = chatWithMessages.messages.find(
    (one) =>
      one.message.messageType === 'DISAPPROVE_CONTACT_REVEAL' ||
      one.message.messageType === 'APPROVE_CONTACT_REVEAL' ||
      one.message.messageType === 'REQUEST_CONTACT_REVEAL'
  )

  return !!contactRevealMessage
})

export const setParentChatActionAtom = atom(
  null,
  (get, set, params: ChatIds) => {
    const parentChatAtom = get(parentChatAtomAtom)
    const parentChat = get(parentChatAtom)

    if (parentChat?.chat.id === params.chatId) return // No changes

    const newChatAtom = valueOrDefaultAtom({
      nullableAtom: focusChatWithMessagesAtom(params),
      dummyValue: dummyChatWithMessages,
    })
    set(parentChatAtomAtom, newChatAtom)
  }
)
