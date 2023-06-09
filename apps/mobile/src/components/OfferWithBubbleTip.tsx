import {Stack, XStack} from 'tamagui'
import OfferInfoPreview from './OfferInfoPreview'
import SvgImage from './Image'
import bubbleTipSvg, {
  bubbleTipSvgNegative,
} from './InsideRouter/components/MarketplaceScreen/images/bubbleTipSvg'
import {type ReactNode, useCallback} from 'react'
import {type OneOfferInState} from '../state/marketplace/domain'
import OfferAuthorAvatar from './OfferAuthorAvatar'
import {TouchableWithoutFeedback} from 'react-native'

export default function OfferWithBubbleTip({
  offer,
  button,
  negative,
  onInfoRectPress,
}: {
  offer: OneOfferInState
  button?: ReactNode
  negative?: boolean
  onInfoRectPress?: () => void
}): JSX.Element {
  const onPress = useCallback(() => {
    if (onInfoRectPress) onInfoRectPress()
  }, [onInfoRectPress])

  return (
    <Stack>
      <TouchableWithoutFeedback onPress={onPress}>
        <Stack bg={negative ? '$grey' : '$white'} p="$4" br="$5">
          <OfferInfoPreview negative={negative} offer={offer.offerInfo} />
          <Stack pos="absolute" b={-7} l={43}>
            <SvgImage source={negative ? bubbleTipSvgNegative : bubbleTipSvg} />
          </Stack>
        </Stack>
      </TouchableWithoutFeedback>
      <XStack ai="center" jc="space-between" mt="$2">
        <OfferAuthorAvatar offer={offer} negative={negative ?? false} />
        {button && button}
      </XStack>
    </Stack>
  )
}
