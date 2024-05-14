import {type ChatMessagePayload} from '@vexl-next/domain/src/general/messaging'
import {type OfferInfo} from '@vexl-next/domain/src/general/offers'
import {type BasicError} from '@vexl-next/domain/src/utility/errors'
import {sendCancelMessagingRequest} from '@vexl-next/resources-utils/src/chat/sendCancelMessagingRequest'
import {type ErrorEncryptingMessage} from '@vexl-next/resources-utils/src/chat/utils/chatCrypto'
import {type ExtractLeftTE} from '@vexl-next/resources-utils/src/utils/ExtractLeft'
import {
  type JsonStringifyError,
  type ZodParseError,
} from '@vexl-next/resources-utils/src/utils/parsing'
import {type ChatPrivateApi} from '@vexl-next/rest-api/src/services/chat'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {atom} from 'jotai'
import {Alert} from 'react-native'
import {privateApiAtom} from '../../../api'
import {
  askAreYouSureActionAtom,
  type UserDeclinedError,
} from '../../../components/AreYouSureDialog'
import {loadingOverlayDisplayedAtom} from '../../../components/LoadingOverlayProvider'
import {version} from '../../../utils/environment'
import {translationAtom} from '../../../utils/localization/I18nProvider'
import showErrorAlert from '../../../utils/showErrorAlert'
import {toCommonErrorMessage} from '../../../utils/useCommonErrorMessages'
import {sessionDataOrDummyAtom} from '../../session'
import {type ChatMessageWithState} from '../domain'
import addMessageToChat from '../utils/addMessageToChat'
import createAccountDeletedMessage from '../utils/createAccountDeletedMessage'
import focusChatByInboxKeyAndSenderKey from './focusChatByInboxKeyAndSenderKey'

type ChatNotFoundError = BasicError<'ChatNotFoundError'>
type CancelRequestApprovalErrors = ExtractLeftTE<
  ReturnType<ChatPrivateApi['cancelRequestApproval']>
>

const cancelRequestActionAtomHandleUI = atom(
  null,
  (
    get,
    set,
    {text, originOffer}: {text: string; originOffer: OfferInfo}
  ): TE.TaskEither<
    | ChatNotFoundError
    | CancelRequestApprovalErrors
    | UserDeclinedError
    | JsonStringifyError
    | ZodParseError<ChatMessagePayload>
    | ErrorEncryptingMessage,
    ChatMessageWithState
  > => {
    const session = get(sessionDataOrDummyAtom)
    const chatAtom = focusChatByInboxKeyAndSenderKey({
      inboxKey: session.privateKey.publicKeyPemBase64,
      senderKey: originOffer.publicPart.offerPublicKey,
    })

    const chatWithMessages = get(chatAtom)
    if (!chatWithMessages)
      return TE.left({
        _tag: 'ChatNotFoundError',
        error: new Error('Chat not found'),
      })

    const {chat} = chatWithMessages
    const api = get(privateApiAtom)
    const {t} = get(translationAtom)

    return pipe(
      TE.Do,
      TE.chainW(() =>
        set(askAreYouSureActionAtom, {
          steps: [
            {
              type: 'StepWithText',
              title: t('messages.cancelRequestDialog.title'),
              description: t('messages.cancelRequestDialog.description'),
              negativeButtonText: t('common.back'),
              positiveButtonText: t('messages.cancelRequestDialog.yes'),
            },
          ],
          variant: 'danger',
        })
      ),
      TE.chainW(() => {
        set(loadingOverlayDisplayedAtom, true)

        return sendCancelMessagingRequest({
          api: api.chat,
          text,
          fromKeypair: chat.inbox.privateKey,
          toPublicKey: chat.otherSide.publicKey,
          myVersion: version,
          theirFcmCypher: chat.otherSideFcmCypher,
          notificationApi: api.notification,
          otherSideVersion: chat.otherSideVersion,
        })
      }),
      TE.map((sentMessage): ChatMessageWithState => {
        const successMessage = {
          message: sentMessage,
          state: 'sent',
        } as const
        set(chatAtom, addMessageToChat(successMessage))
        return successMessage
      }),
      TE.mapLeft((error) => {
        if (error._tag === 'UserDeclinedError') {
          return error
        }
        if (error._tag === 'OtherSideAccountDeleted') {
          set(
            chatAtom,
            addMessageToChat(
              createAccountDeletedMessage({
                senderPublicKey: chat.inbox.privateKey.publicKeyPemBase64,
              })
            )
          )
          Alert.alert(t('offer.otherSideAccountDeleted'))

          return error
        }

        showErrorAlert({
          title: toCommonErrorMessage(error, t) ?? t('common.unknownError'),
          error,
        })
        return error
      }),
      T.map((result) => {
        set(loadingOverlayDisplayedAtom, false)
        return result
      })
    )
  }
)
export default cancelRequestActionAtomHandleUI
