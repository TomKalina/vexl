import {useMolecule} from 'bunshi/dist/react'
import {useMemo} from 'react'
import {getTokens} from 'tamagui'
import {useTranslation} from '../../utils/localization/I18nProvider'
import AmountOfTransaction from '../OfferForm/components/AmountOfTransaction'
import Currency from '../OfferForm/components/Currency'
import Description from '../OfferForm/components/Description'
import Expiration from '../OfferForm/components/Expiration'
import FriendLevel from '../OfferForm/components/FriendLevel'
import Location from '../OfferForm/components/Location'
import Network from '../OfferForm/components/Network'
import PaymentMethod from '../OfferForm/components/PaymentMethod'
import PremiumOrDiscount from '../OfferForm/components/PremiumOrDiscount'
import SpokenLanguages from '../OfferForm/components/SpokenLanguages'
import {type Props} from '../Section'
import amountOfTransactionSvg from '../images/amountOfTransactionSvg'
import coinsSvg from '../images/coinsSvg'
import friendLevelSvg from '../images/friendLevelSvg'
import locationSvg from '../images/locationSvg'
import networkSvg from '../images/networkSvg'
import paymentMethodSvg from '../images/paymentMethod'
import spokenLanguagesSvg from '../images/spokenLanguagesSvg'
import {offerFormMolecule} from './atoms/offerFormStateAtoms'
import descriptionSvg from './images/descriptionSvg'

export default function useContent(): Props[] {
  const {t} = useTranslation()
  const tokens = getTokens()
  const {
    amountTopLimitAtom,
    amountBottomLimitAtom,
    btcNetworkAtom,
    currencyAtom,
    feeAmountAtom,
    feeStateAtom,
    offerDescriptionAtom,
    offerTypeOrDummyValueAtom,
    intendedConnectionLevelAtom,
    locationAtom,
    locationStateAtom,
    paymentMethodAtom,
    expirationDateAtom,
    offerExpirationModalVisibleAtom,
    updateCurrencyLimitsAtom,
    updateLocationStatePaymentMethodAtom,
    setOfferLocationActionAtom,
    spokenLanguagesAtomsAtom,
    removeSpokenLanguageActionAtom,
    createIsThisLanguageSelectedAtom,
    resetSelectedSpokenLanguagesActionAtom,
    saveSelectedSpokenLanguagesActionAtom,
  } = useMolecule(offerFormMolecule)

  return useMemo(
    () => [
      {
        title: t('common.currency'),
        image: coinsSvg,
        children: (
          <Currency
            currencyAtom={currencyAtom}
            updateCurrencyLimitsAtom={updateCurrencyLimitsAtom}
          />
        ),
      },
      {
        title: t('offerForm.amountOfTransaction.amountOfTransaction'),
        image: amountOfTransactionSvg,
        children: (
          <AmountOfTransaction
            amountTopLimitAtom={amountTopLimitAtom}
            amountBottomLimitAtom={amountBottomLimitAtom}
            currencyAtom={currencyAtom}
          />
        ),
      },
      {
        title: t('offerForm.premiumOrDiscount.premiumOrDiscount'),
        customSection: true,
        children: (
          <PremiumOrDiscount
            offerTypeAtom={offerTypeOrDummyValueAtom}
            feeAmountAtom={feeAmountAtom}
            feeStateAtom={feeStateAtom}
          />
        ),
      },
      {
        title: t('offerForm.expiration.expiration'),
        customSection: true,
        children: (
          <Expiration
            expirationDateAtom={expirationDateAtom}
            offerExpirationModalVisibleAtom={offerExpirationModalVisibleAtom}
          />
        ),
      },
      {
        title: t('offerForm.location.location'),
        image: locationSvg,
        children: (
          <Location
            randomizeLocation
            setOfferLocationActionAtom={setOfferLocationActionAtom}
            locationAtom={locationAtom}
            locationStateAtom={locationStateAtom}
            updateLocationStatePaymentMethodAtom={
              updateLocationStatePaymentMethodAtom
            }
          />
        ),
        mandatory: true,
      },
      {
        title: t('offerForm.spokenLanguages.language'),
        image: spokenLanguagesSvg,
        imageFill: tokens.color.white.val,
        children: (
          <SpokenLanguages
            createIsThisLanguageSelectedAtom={createIsThisLanguageSelectedAtom}
            spokenLanguagesAtomsAtom={spokenLanguagesAtomsAtom}
            removeSpokenLanguageActionAtom={removeSpokenLanguageActionAtom}
            resetSelectedSpokenLanguagesActionAtom={
              resetSelectedSpokenLanguagesActionAtom
            }
            saveSelectedSpokenLanguagesActionAtom={
              saveSelectedSpokenLanguagesActionAtom
            }
          />
        ),
        mandatory: true,
      },
      {
        title: t('offerForm.paymentMethod.paymentMethod'),
        image: paymentMethodSvg,
        children: (
          <PaymentMethod
            locationStateAtom={locationStateAtom}
            paymentMethodAtom={paymentMethodAtom}
          />
        ),
        mandatory: true,
      },
      {
        title: t('offerForm.network.network'),
        image: networkSvg,
        children: <Network btcNetworkAtom={btcNetworkAtom} />,
        mandatory: true,
      },
      {
        title: t('offerForm.description.description'),
        image: descriptionSvg,
        children: <Description offerDescriptionAtom={offerDescriptionAtom} />,
        mandatory: true,
      },
      {
        title: t('offerForm.friendLevel.friendLevel'),
        image: friendLevelSvg,
        children: (
          <FriendLevel
            intendedConnectionLevelAtom={intendedConnectionLevelAtom}
          />
        ),
      },
    ],
    [
      t,
      currencyAtom,
      updateCurrencyLimitsAtom,
      amountTopLimitAtom,
      amountBottomLimitAtom,
      offerTypeOrDummyValueAtom,
      feeAmountAtom,
      feeStateAtom,
      expirationDateAtom,
      offerExpirationModalVisibleAtom,
      setOfferLocationActionAtom,
      locationAtom,
      locationStateAtom,
      updateLocationStatePaymentMethodAtom,
      tokens.color.white.val,
      createIsThisLanguageSelectedAtom,
      spokenLanguagesAtomsAtom,
      removeSpokenLanguageActionAtom,
      resetSelectedSpokenLanguagesActionAtom,
      saveSelectedSpokenLanguagesActionAtom,
      paymentMethodAtom,
      btcNetworkAtom,
      offerDescriptionAtom,
      intendedConnectionLevelAtom,
    ]
  )
}
