import {Stack, Text, XStack} from 'tamagui'
import IconButton from '../../IconButton'
import backButtonSvg from '../../../images/backButtonSvg'
import closeSvg from '../../images/closeSvg'
import React from 'react'
import {useAtomValue} from 'jotai'
import headerStateAtom from '../state/headerStateAtom'

function Header(): JSX.Element | null {
  const headerState = useAtomValue(headerStateAtom)

  return !headerState.hidden && !headerState.hiddenAllTheWay ? (
    <XStack ai={'center'} jc={'space-between'} pb={'$2'}>
      {headerState.goBack ? (
        <IconButton
          variant={'primary'}
          icon={backButtonSvg}
          onPress={headerState.goBack}
        />
      ) : (
        <Stack />
      )}
      <Text fos={20} ff={'$body600'} col={'$white'}>
        {headerState.title}
      </Text>
      {headerState.onClose ? (
        <IconButton icon={closeSvg} onPress={headerState.onClose} />
      ) : (
        <Stack />
      )}
    </XStack>
  ) : !headerState.hiddenAllTheWay ? (
    <Stack h={48} />
  ) : (
    <></>
  )
}

export default Header
