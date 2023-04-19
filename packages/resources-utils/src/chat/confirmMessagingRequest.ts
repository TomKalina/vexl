import {
  type PrivateKeyHolder,
  type PublicKeyPemBase64,
} from '@vexl-next/cryptography/dist/KeyHolder'
import {type ChatMessage} from '@vexl-next/domain/dist/general/messaging'
import {now} from '@vexl-next/domain/dist/utility/UnixMilliseconds.brand'
import * as TE from 'fp-ts/TaskEither'
import generateUuid from '../utils/generateUuid'
import {type ChatPrivateApi} from '@vexl-next/rest-api/dist/services/chat'
import {flow, pipe} from 'fp-ts/function'
import {encryptMessage, type ErrorEncryptingMessage} from './utils/chatCrypto'
import {type BasicError, toError} from '@vexl-next/domain/dist/utility/errors'

function createApproveChatMessage({
  text,
  senderPublicKey,
  approve,
}: {
  text: string
  senderPublicKey: PublicKeyPemBase64
  approve: boolean
}): ChatMessage {
  return {
    uuid: generateUuid(),
    messageType: approve ? 'APPROVE_MESSAGING' : 'DISAPPROVE_MESSAGING',
    text,
    time: now(),
    senderPublicKey,
  }
}

export type ApiConfirmMessagingRequest =
  BasicError<'ApiConfirmMessagingRequest'>

export default function confirmMessagingRequest({
  text,
  fromKeypair,
  toPublicKey,
  api,
  approve,
}: {
  text: string
  fromKeypair: PrivateKeyHolder
  toPublicKey: PublicKeyPemBase64
  api: ChatPrivateApi
  approve: boolean
}): TE.TaskEither<
  ApiConfirmMessagingRequest | ErrorEncryptingMessage,
  ChatMessage
> {
  return pipe(
    createApproveChatMessage({
      text,
      senderPublicKey: fromKeypair.publicKeyPemBase64,
      approve,
    }),
    TE.right,
    TE.chainFirstW(
      flow(
        encryptMessage(toPublicKey),
        TE.chainFirstW((message) =>
          pipe(
            api.approveRequest({
              message,
              approve,
              keyPair: fromKeypair,
              publicKeyToConfirm: toPublicKey,
            }),
            TE.mapLeft(toError('ApiConfirmMessagingRequest'))
          )
        )
      )
    )
  )
}