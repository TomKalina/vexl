import {E164PhoneNumber} from '@vexl-next/domain/src/general/E164PhoneNumber.brand'
import {UriString} from '@vexl-next/domain/src/utility/UriString.brand'
import {z} from 'zod'

export const ContactInfo = z.object({
  name: z.string(),
  label: z.string().optional(),
  numberToDisplay: z.string(),
  rawNumber: z.string(),
  imageUri: UriString.optional(),
})
export type ContactInfo = z.TypeOf<typeof ContactInfo>

export const ContactComputedValues = z.object({
  normalizedNumber: E164PhoneNumber,
  hash: z.string(),
})
export type ContactComputedValues = z.TypeOf<typeof ContactComputedValues>

export const ContactFlags = z.object({
  seen: z.boolean(),
  imported: z.boolean(),
  importedManually: z.boolean(),
  invalidNumber: z.enum(['notTriedYet', 'valid', 'invalid']),
})
export type ContactFlags = z.TypeOf<typeof ContactFlags>

export const StoredContact = z.object({
  info: ContactInfo,
  computedValues: ContactComputedValues.optional(),
  flags: ContactFlags.default({
    seen: false,
    imported: false,
    importedManually: false,
    invalidNumber: 'notTriedYet',
  }),
})
export type StoredContact = z.TypeOf<typeof StoredContact>

export const StoredContactWithComputedValues = z.object({
  info: ContactInfo,
  computedValues: ContactComputedValues,
  flags: ContactFlags.default({
    seen: false,
    imported: false,
    importedManually: false,
    invalidNumber: 'notTriedYet',
  }),
})
export type StoredContactWithComputedValues = z.TypeOf<
  typeof StoredContactWithComputedValues
>

export type StoredContactWithoutComputedValues = StoredContact & {
  computedValues: undefined
}

export const ImportContactFromLinkPayload = z.object({
  name: z.string(),
  label: z.string(),
  numberToDisplay: z.string(),
  imageUri: UriString.optional(),
})
export type ImportContactFromLinkPayload = z.TypeOf<
  typeof ImportContactFromLinkPayload
>

export function hasComputedValues(
  contact: StoredContact
): contact is StoredContactWithComputedValues {
  return !!contact.computedValues
}
