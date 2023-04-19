import {pipe} from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import {getPrivateApi} from '../api'
import {type OfferAdminId} from '@vexl-next/rest-api/dist/services/offer/contracts'
import {OfferPublicPart} from '@vexl-next/domain/dist/general/offers'
import {parseCredentialsJson} from '../utils/auth'
import {
  parseJson,
  safeParse,
  stringifyToPrettyJson,
} from '@vexl-next/resources-utils/dist/utils/parsing'
import {updateOfferReencryptForAll} from '@vexl-next/resources-utils/dist/offers/updateOffer'
import {type ConnectionLevel} from '@vexl-next/rest-api/dist/services/contact/contracts'

export default function updatePublicPartReencryptAll({
  publicPayloadJson,
  ownerCredentialsJson,
  adminId,
  connectionLevel,
}: {
  adminId: OfferAdminId
  publicPayloadJson: string
  ownerCredentialsJson: string
  connectionLevel: ConnectionLevel
}) {
  return pipe(
    E.of({}),
    E.bindW('ownerCredentials', () =>
      parseCredentialsJson(ownerCredentialsJson)
    ),
    E.bindW('api', ({ownerCredentials}) =>
      E.right(getPrivateApi(ownerCredentials))
    ),
    TE.fromEither,
    TE.bindW('publicPayload', () =>
      pipe(
        E.of(publicPayloadJson),
        E.chainW(parseJson),
        E.chainW(safeParse(OfferPublicPart)),
        TE.fromEither
      )
    ),
    TE.chainW(({ownerCredentials, publicPayload, api}) =>
      updateOfferReencryptForAll({
        offerApi: api.offer,
        adminId,
        publicPayload,
        ownerKeyPair: ownerCredentials.keypair,
        connectionLevel,
        contactApi: api.contact,
      })
    ),
    TE.chainEitherKW(stringifyToPrettyJson)
  )
}