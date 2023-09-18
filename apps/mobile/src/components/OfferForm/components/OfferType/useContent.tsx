import {useTranslation} from '../../../../utils/localization/I18nProvider'
import {type TabProps} from '../../../Tabs'
import {type OfferType} from '@vexl-next/domain/dist/general/offers'
import {useMemo} from 'react'

export default function useContent(): Array<TabProps<OfferType>> {
  const {t} = useTranslation()

  return useMemo(
    () => [
      {
        title: t('offerForm.sellHoney'),
        type: 'SELL',
      },
      {
        title: t('offerForm.buyHoney'),
        type: 'BUY',
      },
    ],
    [t]
  )
}
