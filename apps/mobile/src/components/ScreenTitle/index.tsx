import closeSvg from '../images/closeSvg'
import {Stack, Text, XStack, YStack, type YStackProps} from 'tamagui'
import IconButton from '../IconButton'

interface Props extends YStackProps {
  onClosePress: () => void
  text: string
  withBottomBorder?: boolean
}

function ScreenTitle({
  onClosePress,
  text,
  withBottomBorder = false,
  ...props
}: Props): JSX.Element {
  return (
    <YStack {...props}>
      <XStack fd="row" ai="flex-start" jc="space-between" padding="$1" mb="$5">
        <Stack fs={1} maw="70%">
          <Text color="$white" fontSize={32} ff="$heading">
            {text}
          </Text>
        </Stack>
        <IconButton variant="dark" icon={closeSvg} onPress={onClosePress} />
      </XStack>
      {withBottomBorder && <Stack h={0.5} mx="$-4" bg="$grey" />}
    </YStack>
  )
}

export default ScreenTitle
