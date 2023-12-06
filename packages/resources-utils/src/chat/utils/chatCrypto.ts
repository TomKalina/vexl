import {
  type PrivateKeyHolder,
  type PrivateKeyPemBase64,
  type PublicKeyPemBase64,
} from '@vexl-next/cryptography/dist/KeyHolder'
import {
  type ChatMessage,
  ChatMessagePayload,
} from '@vexl-next/domain/dist/general/messaging'
import {pipe} from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import {parseJson, safeParse, stringifyToJson} from '../../utils/parsing'
import {eciesDecrypt, eciesEncrypt} from '../../utils/crypto'
import {type ServerMessage} from '@vexl-next/rest-api/dist/services/chat/contracts'
import {type BasicError, toError} from '@vexl-next/domain/dist/utility/errors'
import {UriString} from '@vexl-next/domain/dist/utility/UriString.brand'
import {Base64String} from '@vexl-next/domain/dist/utility/Base64String.brand'
import truncate from 'just-truncate'

export type ErrorEncryptingMessage = BasicError<'ErrorEncryptingMessage'>

export function encryptMessage(
  publicKey: PublicKeyPemBase64
): (message: ChatMessage) => TE.TaskEither<ErrorEncryptingMessage, string> {
  return (message: ChatMessage) => {
    const deanonymizedUser = (():
      | ChatMessagePayload['deanonymizedUser']
      | undefined => {
      if (
        (message.messageType === 'REQUEST_REVEAL' ||
          message.messageType === 'APPROVE_REVEAL' ||
          message.messageType === 'REQUEST_CONTACT_REVEAL' ||
          message.messageType === 'APPROVE_CONTACT_REVEAL') &&
        message.deanonymizedUser
      ) {
        const {name, partialPhoneNumber} = message.deanonymizedUser

        if (!message.image) return message.deanonymizedUser

        return pipe(
          message.image?.replace(/data:image\/.*;base64,/, ''),
          safeParse(Base64String),
          E.match(
            () => message.deanonymizedUser,
            (image) => ({
              name,
              partialPhoneNumber,
              imageBase64: image,
            })
          )
        )
      }

      return undefined
    })()

    return pipe(
      TE.right<never, ChatMessagePayload>({
        time: message.time,
        text: message.text,
        uuid: message.uuid,
        image: message.image,
        repliedTo: message.repliedTo,
        messageType: message.messageType,
        tradeChecklistUpdate: message.tradeChecklistUpdate,
        deanonymizedUser,
      }),
      TE.chainEitherKW(safeParse(ChatMessagePayload)),
      TE.chainEitherKW(stringifyToJson),
      TE.chainW(eciesEncrypt(publicKey)),
      TE.mapLeft(toError('ErrorEncryptingMessage'))
    )
  }
}

export type ErrorDecryptingMessage = BasicError<'ErrorDecryptingMessage'>

export function decryptMessage(
  privateKey: PrivateKeyHolder
): (
  message: ServerMessage
) => TE.TaskEither<ErrorDecryptingMessage, ChatMessage> {
  return (message: ServerMessage) =>
    pipe(
      eciesDecrypt(privateKey.privateKeyPemBase64)(message.message),
      TE.chainEitherKW(parseJson),
      TE.chainEitherKW(safeParse(ChatMessagePayload)),
      TE.bindTo('payload'),
      TE.bindW('messageImage', ({payload}) => {
        if (payload.image) return TE.right(payload.image)

        if (
          (message.messageType === 'APPROVE_REVEAL' ||
            message.messageType === 'REQUEST_REVEAL') &&
          payload.deanonymizedUser?.imageBase64
        ) {
          return pipe(
            `data:image/jpg;base64,${payload.deanonymizedUser.imageBase64}`,
            safeParse(UriString),
            E.fold(
              () => undefined,
              (r) => r
            ),
            TE.right
          )
        }
        return TE.right(undefined)
      }),
      TE.map(({payload, messageImage}): ChatMessage => {
        return {
          uuid: payload.uuid,
          time: payload.time,
          repliedTo: payload.repliedTo,
          text: payload.text ?? '-',
          messageType: payload.messageType ?? message.messageType,
          image: payload.image ?? messageImage,
          deanonymizedUser: payload.deanonymizedUser
            ? {
                name: payload.deanonymizedUser.name,
                partialPhoneNumber: payload.deanonymizedUser.partialPhoneNumber,
                fullPhoneNumber: payload.deanonymizedUser.fullPhoneNumber,
              }
            : undefined,
          senderPublicKey: message.senderPublicKey,
          tradeChecklistUpdate: payload.tradeChecklistUpdate,
        }
      }),
      TE.mapLeft(toError('ErrorDecryptingMessage'))
    )
}

export function encryptMessagePreview(
  publicKey: PublicKeyPemBase64
): (
  message: ChatMessage
) => TE.TaskEither<ErrorEncryptingMessage, string | undefined> {
  return (message: ChatMessage) => {
    if (message.messageType !== 'MESSAGE') return TE.right(undefined)
    return pipe(
      TE.right(truncate(message.text, 250)),
      TE.chainW(eciesEncrypt(publicKey)),
      TE.mapLeft(toError('ErrorEncryptingMessage'))
    )
  }
}

export function decryptMessagePreview(
  privKey: PrivateKeyPemBase64
): (message: string) => TE.TaskEither<ErrorDecryptingMessage, string> {
  return (message) => {
    return pipe(
      eciesDecrypt(privKey)(message),
      TE.mapLeft(toError('ErrorDecryptingMessage'))
    )
  }
}
