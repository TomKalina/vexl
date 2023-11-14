import {unflatten} from 'flat'

import base from '@vexl-next/localization/base.json'
import privacyPolicyDev from '@vexl-next/localization/privacyPolicy.json'
import termsOfUse from '@vexl-next/localization/termsOfUse.json'

import csBase from '@vexl-next/localization/cs-base.json'
import csPrivacyPolicyDev from '@vexl-next/localization/cs-privacyPolicy.json'
import csTermsOfUse from '@vexl-next/localization/cs-termsOfUse.json'

import deBase from '@vexl-next/localization/de-base.json'
import dePrivacyPolicyDev from '@vexl-next/localization/de-privacyPolicy.json'
import deTermsOfUse from '@vexl-next/localization/de-termsOfUse.json'

import enBase from '@vexl-next/localization/en-base.json'
import enPrivacyPolicyDev from '@vexl-next/localization/en-privacyPolicy.json'
import enTermsOfUse from '@vexl-next/localization/en-termsOfUse.json'

import frBase from '@vexl-next/localization/fr-base.json'
import frPrivacyPolicyDev from '@vexl-next/localization/fr-privacyPolicy.json'
import frTermsOfUse from '@vexl-next/localization/fr-termsOfUse.json'

import itBase from '@vexl-next/localization/it-base.json'
import itPrivacyPolicyDev from '@vexl-next/localization/it-privacyPolicy.json'
import itTermsOfUse from '@vexl-next/localization/it-termsOfUse.json'

import ptBase from '@vexl-next/localization/pt-base.json'
import ptPrivacyPolicyDev from '@vexl-next/localization/pt-privacyPolicy.json'
import ptTermsOfUse from '@vexl-next/localization/pt-termsOfUse.json'

import esBase from '@vexl-next/localization/es-base.json'
import esPrivacyPolicyDev from '@vexl-next/localization/es-privacyPolicy.json'
import esTermsOfUse from '@vexl-next/localization/es-termsOfUse.json'

import skBase from '@vexl-next/localization/sk-base.json'
import skPrivacyPolicyDev from '@vexl-next/localization/sk-privacyPolicy.json'
import skTermsOfUse from '@vexl-next/localization/sk-termsOfUse.json'

export const dev = {
  ...unflatten<typeof base, typeof base>(base),
  termsOfUseMD: termsOfUse,
  privacyPolicyMD: privacyPolicyDev,
} as const

export const cs = {
  ...unflatten<typeof csBase, typeof base>(csBase),
  termsOfUseMD: csTermsOfUse,
  privacyPolicyMD: csPrivacyPolicyDev,
} as const

export const de = {
  ...unflatten<typeof deBase, typeof base>(deBase),
  termsOfUseMD: deTermsOfUse,
  privacyPolicyMD: dePrivacyPolicyDev,
} as const

export const en = {
  ...unflatten<typeof enBase, typeof base>(enBase),
  termsOfUseMD: enTermsOfUse,
  privacyPolicyMD: enPrivacyPolicyDev,
} as const

export const fr = {
  ...unflatten<typeof frBase, typeof base>(frBase),
  termsOfUseMD: frTermsOfUse,
  privacyPolicyMD: frPrivacyPolicyDev,
} as const

export const it = {
  ...unflatten<typeof itBase, typeof base>(itBase),
  termsOfUseMD: itTermsOfUse,
  privacyPolicyMD: itPrivacyPolicyDev,
} as const

export const pt = {
  ...unflatten<typeof ptBase, typeof base>(ptBase),
  termsOfUseMD: ptTermsOfUse,
  privacyPolicyMD: ptPrivacyPolicyDev,
} as const

export const es = {
  ...unflatten<typeof esBase, typeof base>(esBase),
  termsOfUseMD: esTermsOfUse,
  privacyPolicyMD: esPrivacyPolicyDev,
} as const

export const sk = {
  ...unflatten<typeof skBase, typeof base>(skBase),
  termsOfUseMD: skTermsOfUse,
  privacyPolicyMD: skPrivacyPolicyDev,
} as const
