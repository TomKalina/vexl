import Animated, {FadeIn} from 'react-native-reanimated'
import {Stack} from 'tamagui'
import PageWithNavigationHeader from '../../PageWithNavigationHeader'
import {StyleSheet} from 'react-native'
import {atom, useAtomValue, useSetAtom} from 'jotai'
import {useFocusEffect} from '@react-navigation/native'
import {useCallback} from 'react'

const styles = StyleSheet.create({
  backdrop: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
})

export const isTradeChecklistFullScreenAtom = atom(false)

export function useSetFullscreen(): void {
  const setFullscreen = useSetAtom(isTradeChecklistFullScreenAtom)

  useFocusEffect(
    useCallback(() => {
      setFullscreen(true)

      return () => {
        setFullscreen(false)
      }
    }, [setFullscreen])
  )
}

export default function TradeChecklistFlowPageContainer({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const isFullScreen = useAtomValue(isTradeChecklistFullScreenAtom)

  return (
    <>
      {!isFullScreen && (
        <>
          <Animated.View entering={FadeIn.delay(200)} style={styles.backdrop} />
          <Stack h={100} />
          <Stack
            width={36}
            h={5}
            als={'center'}
            bc={'$greyAccent1'}
            br={'$5'}
            mt={'$4'}
          />
        </>
      )}
      <PageWithNavigationHeader fullScreen={isFullScreen}>
        {children}
      </PageWithNavigationHeader>
    </>
  )
}