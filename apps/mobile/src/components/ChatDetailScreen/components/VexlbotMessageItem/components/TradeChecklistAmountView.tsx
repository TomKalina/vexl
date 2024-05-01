import Clipboard from '@react-native-clipboard/clipboard'
import {useNavigation} from '@react-navigation/native'
import {useMolecule} from 'bunshi/dist/react'
import {useAtomValue, useSetAtom} from 'jotai'
import {useCallback, useMemo} from 'react'
import {Stack, XStack, getTokens} from 'tamagui'
import {SATOSHIS_IN_BTC} from '../../../../../state/currentBtcPriceAtoms'
import * as amount from '../../../../../state/tradeChecklist/utils/amount'
import {calculateBtcPricePercentageDifference} from '../../../../../state/tradeChecklist/utils/amount'
import {
  getCurrentLocale,
  useTranslation,
} from '../../../../../utils/localization/I18nProvider'
import {currencies} from '../../../../../utils/localization/currency'
import {preferencesAtom} from '../../../../../utils/preferences'
import Button from '../../../../Button'
import {loadingOverlayDisplayedAtom} from '../../../../LoadingOverlayProvider'
import {
  toastNotificationAtom,
  type ToastNotificationState,
} from '../../../../ToastNotification'
import {
  addAmountActionAtom,
  submitTradeChecklistUpdatesActionAtom,
} from '../../../../TradeChecklistFlow/atoms/updatesToBeSentAtom'
import {chatMolecule} from '../../../atoms'
import copySvg from '../../../images/copySvg'
import checkIconSvg from '../../images/checkIconSvg'
import VexlbotBubble from './VexlbotBubble'

function TradeChecklistAmountView(): JSX.Element | null {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {
    chatIdAtom,
    publicKeyPemBase64Atom,
    otherSideDataAtom,
    tradeChecklistAmountAtom,
    btcPriceForTradeCurrencyAtom,
    tradeOrOriginOfferCurrencyAtom,
  } = useMolecule(chatMolecule)
  const tradeOrOriginOfferCurrency = useAtomValue(
    tradeOrOriginOfferCurrencyAtom
  )
  const preferences = useAtomValue(preferencesAtom)
  const currentLocale = preferences.appLanguage ?? getCurrentLocale()
  const amountData = useAtomValue(tradeChecklistAmountAtom)
  const otherSideData = useAtomValue(otherSideDataAtom)
  const amountDataToDisplay = amount.getAmountData(amountData)
  const chatId = useAtomValue(chatIdAtom)
  const inboxKey = useAtomValue(publicKeyPemBase64Atom)
  const showLoadingOverlay = useSetAtom(loadingOverlayDisplayedAtom)
  const submitTradeChecklistUpdates = useSetAtom(
    submitTradeChecklistUpdatesActionAtom
  )
  const addAmount = useSetAtom(addAmountActionAtom)
  const btcPriceForTradeCurrency = useAtomValue(btcPriceForTradeCurrencyAtom)
  const setToastNotification = useSetAtom(toastNotificationAtom)

  const toastContent: ToastNotificationState = useMemo(
    () => ({
      text: t('common.copied'),
      icon: checkIconSvg,
    }),
    [t]
  )

  const btcPricePercentageDifference = useMemo(
    () =>
      calculateBtcPricePercentageDifference(
        amountDataToDisplay,
        btcPriceForTradeCurrency?.btcPrice
      ),
    [amountDataToDisplay, btcPriceForTradeCurrency?.btcPrice]
  )

  const onAcceptButtonPress = useCallback(() => {
    if (amountData.received) {
      showLoadingOverlay(true)
      addAmount(amountData?.received)
      void submitTradeChecklistUpdates()().finally(() => {
        showLoadingOverlay(false)
      })
    }
  }, [
    addAmount,
    amountData.received,
    showLoadingOverlay,
    submitTradeChecklistUpdates,
  ])

  const onEditPress = useCallback(() => {
    navigation.navigate('TradeChecklistFlow', {
      screen: 'CalculateAmount',
      params: {
        amountData: {
          ...amountData.received,
          // on the side of receiver we need to map the type to custom but preserve it on side of creator (for edit trade price purposes)
          tradePriceType:
            amountData.received?.tradePriceType === 'your'
              ? 'custom'
              : amountData.received?.tradePriceType,
        },
      },
      chatId,
      inboxKey,
    })
  }, [amountData.received, chatId, inboxKey, navigation])

  if (!amountDataToDisplay?.amountData.btcAmount) return null

  const renderFooter = ((): JSX.Element | null => {
    if (amountDataToDisplay.status !== 'pending') {
      return (
        <>
          {!!amountDataToDisplay.amountData.btcAmount && (
            <Button
              text="BTC"
              beforeIcon={copySvg}
              onPress={() => {
                Clipboard.setString(
                  `${amountDataToDisplay.amountData.btcAmount}`
                )
                setToastNotification(toastContent)
              }}
              size="small"
              variant="primary"
              iconFill={getTokens().color.main.val}
            />
          )}
          {!!amountDataToDisplay.amountData.btcAmount && (
            <Button
              text="SAT"
              beforeIcon={copySvg}
              onPress={() => {
                Clipboard.setString(
                  `${
                    amountDataToDisplay.amountData.btcAmount
                      ? Math.round(
                          amountDataToDisplay.amountData.btcAmount *
                            SATOSHIS_IN_BTC
                        )
                      : 0
                  }`
                )
                setToastNotification(toastContent)
              }}
              size="small"
              variant="primary"
              iconFill={getTokens().color.main.val}
            />
          )}
          {!!amountDataToDisplay.amountData.fiatAmount && (
            <Button
              text={currencies[tradeOrOriginOfferCurrency].code}
              beforeIcon={copySvg}
              onPress={() => {
                Clipboard.setString(
                  `${amountDataToDisplay.amountData.fiatAmount}`
                )
                setToastNotification(toastContent)
              }}
              size="small"
              variant="primary"
              iconFill={getTokens().color.main.val}
            />
          )}
        </>
      )
    }

    if (
      amountDataToDisplay.by === 'them' &&
      amountDataToDisplay.status === 'pending'
    ) {
      return (
        <XStack ai="center" jc="space-between" space="$2">
          <Button
            fullSize
            disabled={!amountData?.received}
            onPress={onEditPress}
            variant="primary"
            size="small"
            text={t('common.change')}
          />
          <Button
            fullSize
            disabled={!amountData?.received}
            onPress={onAcceptButtonPress}
            variant="secondary"
            size="small"
            text={t('common.accept')}
          />
        </XStack>
      )
    }

    return null
  })()

  return (
    <Stack>
      <VexlbotBubble
        status={
          amountDataToDisplay.by === 'them' &&
          amountDataToDisplay.status === 'pending'
            ? undefined
            : amountDataToDisplay.status
        }
        introText={
          amountDataToDisplay.status !== 'accepted' &&
          amountDataToDisplay.by === 'them' &&
          (amountDataToDisplay.amountData.tradePriceType === 'custom' ||
            amountDataToDisplay.amountData.tradePriceType === 'your' ||
            amountDataToDisplay.amountData.tradePriceType === 'frozen')
            ? `${t(
                'tradeChecklist.calculateAmount.choseToCalculateWithCustomPrice',
                {
                  username: otherSideData.userName,
                  percentage: Math.abs(btcPricePercentageDifference),
                }
              )} ${
                btcPricePercentageDifference >= 0
                  ? t('vexlbot.higherThanLivePrice')
                  : t('vexlbot.lowerThanLivePrice')
              }`
            : undefined
        }
        text={t(
          amountDataToDisplay.status === 'pending'
            ? 'vexlbot.settledAmountOfTheDeal'
            : 'vexlbot.suggestedAmountOfTheDeal',
          {
            username:
              amountDataToDisplay.by === 'me'
                ? t('common.you')
                : otherSideData.userName,
            btcAmount:
              amountDataToDisplay.amountData.btcAmount?.toLocaleString(
                currentLocale
              ),
            fiatAmount:
              amountDataToDisplay.amountData.fiatAmount?.toLocaleString(
                currentLocale
              ),
            fiatCurrency: currencies[tradeOrOriginOfferCurrency].code,
            feeAmount: amountDataToDisplay.amountData.feeAmount,
            btcTradePrice:
              amountDataToDisplay.amountData.btcPrice?.toLocaleString(
                currentLocale
              ),
          }
        )}
      >
        <XStack f={1} ai="center" jc="space-between">
          {renderFooter}
        </XStack>
      </VexlbotBubble>
    </Stack>
  )
}

export default TradeChecklistAmountView
