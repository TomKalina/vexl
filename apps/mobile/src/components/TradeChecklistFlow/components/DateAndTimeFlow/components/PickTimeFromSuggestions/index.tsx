import {UnixMilliseconds} from '@vexl-next/domain/src/utility/UnixMilliseconds.brand'
import {useSetAtom, useStore} from 'jotai'
import {DateTime} from 'luxon'
import {useCallback} from 'react'
import {Stack} from 'tamagui'
import type {TradeChecklistStackScreenProps} from '../../../../../../navigationTypes'
import {chatWithMessagesKeys} from '../../../../../../state/tradeChecklist/atoms/fromChatAtoms'
import {useTranslation} from '../../../../../../utils/localization/I18nProvider'
import useSafeGoBack from '../../../../../../utils/useSafeGoBack'
import {loadingOverlayDisplayedAtom} from '../../../../../LoadingOverlayProvider'
import {
  HeaderProxy,
  PrimaryFooterButtonProxy,
  SecondaryFooterButtonProxy,
} from '../../../../../PageWithNavigationHeader'
import {
  saveDateTimePickActionAtom,
  submitTradeChecklistUpdatesActionAtom,
} from '../../../../atoms/updatesToBeSentAtom'
import Content from '../../../Content'
import Header from '../../../Header'
import OptionsList from '../OptionsList'
import {useState} from './state'

type Props = TradeChecklistStackScreenProps<'PickTimeFromSuggestions'>

function PickTimeFromSuggestions({
  navigation,
  route: {
    params: {chosenDay, submitUpdateOnTimePick},
  },
}: Props): JSX.Element {
  const {t} = useTranslation()
  const goBack = useSafeGoBack()
  const store = useStore()

  const {selectItem, selectedItem, itemsAtoms} = useState(chosenDay)
  const showLoadingOverlay = useSetAtom(loadingOverlayDisplayedAtom)
  const saveDateTimePick = useSetAtom(saveDateTimePickActionAtom)
  const submitTradeChecklistUpdates = useSetAtom(
    submitTradeChecklistUpdatesActionAtom
  )

  const onItemPress = useCallback(
    (item: DateTime) => {
      if (submitUpdateOnTimePick) {
        selectItem(item)
      } else {
        saveDateTimePick({dateTime: UnixMilliseconds.parse(item.toMillis())})
        navigation.navigate('AgreeOnTradeDetails')
      }
    },
    [navigation, saveDateTimePick, selectItem, submitUpdateOnTimePick]
  )

  const onFooterButtonPress = useCallback(() => {
    if (!selectedItem) return

    showLoadingOverlay(true)
    saveDateTimePick({
      dateTime: UnixMilliseconds.parse(selectedItem.data.toMillis()),
    })
    void submitTradeChecklistUpdates()()
      .then((success) => {
        if (!success) return
        navigation.navigate('ChatDetail', store.get(chatWithMessagesKeys))
      })
      .finally(() => {
        showLoadingOverlay(false)
      })
  }, [
    navigation,
    saveDateTimePick,
    selectedItem,
    showLoadingOverlay,
    store,
    submitTradeChecklistUpdates,
  ])

  return (
    <>
      <HeaderProxy
        title={DateTime.fromMillis(chosenDay.date).toLocaleString({
          day: 'numeric',
          month: 'numeric',
          weekday: 'short',
        })}
        onClose={goBack}
      />

      <Content>
        <Header title={t('tradeChecklist.dateAndTime.selectTime')} />
        <Stack h="$1" />
        <OptionsList<DateTime> onItemPress={onItemPress} items={itemsAtoms} />
      </Content>
      <PrimaryFooterButtonProxy hidden />
      <SecondaryFooterButtonProxy
        text={t('common.continue')}
        hidden={!submitUpdateOnTimePick}
        disabled={!selectedItem}
        onPress={onFooterButtonPress}
      />
    </>
  )
}

export default PickTimeFromSuggestions
