import {type SvgString} from '@vexl-next/domain/src/utility/SvgString.brand'
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from 'react'
import {
  Platform,
  TextInput as RNTextInput,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native'
import {
  Stack,
  Text,
  XStack,
  getTokens,
  styled,
  type ColorTokens,
  type XStackProps,
} from 'tamagui'
import Image from './Image'
import clearInputSvg from './images/clearInputSvg'

const RootContainer = styled(XStack, {
  ai: 'center',
  br: '$4',
  variants: {
    size: {
      small: {
        p: '$2',
      },
      medium: {
        p: '$4',
      },
    },
    variant: {
      greyOnWhite: {
        bc: '$greyAccent5',
      },
      greyOnBlack: {
        bc: '$grey',
      },
      transparentOnGrey: {
        bc: 'transparent',
        p: '$0',
      },
      black: {
        bc: '$black',
      },
    },
  } as const,
})

const InputStyled = styled(RNTextInput, {
  f: 1,
  ff: '$body500',
  variants: {
    size: {
      small: {
        fos: 16,
      },
      medium: {
        fos: 18,
      },
    },
    variant: {
      greyOnWhite: {
        color: '$darkColorText',
      },
      greyOnBlack: {
        color: '$main',
      },
      transparentOnGrey: {
        color: '$greyOnBlack',
      },
      black: {
        color: '$white',
        selectionColor: getTokens().color.main.val,
      },
    },
    textColor: {
      '...color': (color) => {
        return {
          color,
        }
      },
    },
  } as const,
})

const StyledText = styled(Text, {
  fos: 18,
  variants: {
    variant: {
      greyOnWhite: {
        color: '$darkColorText',
      },
      greyOnBlack: {
        color: '$main',
      },
      transparentOnGrey: {
        color: '$greyOnBlack',
      },
      black: {
        color: '$white',
        selectionColor: getTokens().color.main.val,
      },
    },
    textColor: {
      '...color': (color) => {
        return {
          color,
        }
      },
    },
  } as const,
})

export interface Props extends Omit<TextInputProps, 'style'> {
  icon?: SvgString
  leftText?: string
  rightText?: string
  size?: 'small' | 'medium'
  showClearButton?: boolean
  onClearPress?: () => void
  style?: XStackProps
  textColor?: ColorTokens
  leftTextColor?: ColorTokens
  rightTextColor?: ColorTokens
  variant?: 'greyOnWhite' | 'greyOnBlack' | 'transparentOnGrey' | 'black'
  rightElement?: ReactNode
  borderRadius?: ComponentProps<typeof RootContainer>['borderRadius']
  numberOfLines?: ComponentProps<typeof InputStyled>['numberOfLines']
  multiline?: ComponentProps<typeof InputStyled>['multiline']
}

function TextInput(
  {
    style,
    size = 'medium',
    icon,
    leftText,
    rightText,
    showClearButton,
    onClearPress,
    leftTextColor = '$greyOnBlack',
    rightTextColor = '$greyOnBlack',
    textColor,
    variant = 'greyOnWhite',
    rightElement,
    borderRadius,
    multiline,
    numberOfLines,
    ...restProps
  }: Props,
  ref: Ref<RNTextInput>
): JSX.Element {
  const tokens = getTokens()
  const inputRef: Ref<RNTextInput> = useRef(null)
  useImperativeHandle<RNTextInput | null, RNTextInput | null>(
    ref,
    () => inputRef.current
  )

  return (
    <RootContainer
      variant={variant}
      size={size}
      borderRadius={borderRadius ?? '$4'}
      {...style}
    >
      {!!icon && (
        <Stack mr="$2">
          <Stack w={size === 'small' ? 14 : 24} h={size === 'small' ? 14 : 24}>
            <Image
              stroke={
                variant === 'greyOnBlack'
                  ? tokens.color.white.val
                  : tokens.color.grey.val
              }
              source={icon}
            />
          </Stack>
        </Stack>
      )}
      {!!leftText && (
        <Stack maw="50%" fs={1}>
          <StyledText
            numberOfLines={2}
            adjustsFontSizeToFit
            mr="$2"
            variant={variant}
            textColor={leftTextColor}
          >
            {leftText}
          </StyledText>
        </Stack>
      )}
      <InputStyled
        multiline={multiline}
        ref={inputRef}
        textAlignVertical={numberOfLines ? 'top' : 'center'}
        numberOfLines={numberOfLines}
        placeholderTextColor={tokens.color.greyOnBlack.val}
        cursorColor={
          variant === 'greyOnBlack'
            ? tokens.color.greyOnBlack.val
            : variant === 'transparentOnGrey'
            ? tokens.color.greyOnBlack.val
            : tokens.color.darkColorText.val
        }
        // android selectionColor not reducing color opacity by default
        selectionColor={
          variant === 'greyOnBlack'
            ? Platform.OS === 'android'
              ? 'rgba(252, 205, 108, 0.3)'
              : tokens.color.greyOnBlack.val
            : variant === 'transparentOnGrey'
            ? Platform.OS === 'android'
              ? 'rgba(175, 175, 175, 0.3)'
              : tokens.color.greyOnBlack.val
            : Platform.OS === 'android'
            ? 'rgba(0, 0, 0, 0.3)'
            : tokens.color.darkColorText.val
        }
        size={size}
        variant={variant}
        textColor={textColor}
        {...restProps}
      />
      {!!showClearButton && (
        <TouchableOpacity
          onPress={() => {
            inputRef.current?.clear()
            onClearPress?.()
          }}
        >
          <Image
            height={22}
            stroke={tokens.color.grey.val}
            source={clearInputSvg}
          />
        </TouchableOpacity>
      )}
      {!!rightText && (
        <Stack fs={1}>
          <StyledText
            adjustsFontSizeToFit
            ml="$2"
            variant={variant}
            textColor={rightTextColor}
          >
            {rightText}
          </StyledText>
        </Stack>
      )}
      {rightElement ?? null}
    </RootContainer>
  )
}

export default forwardRef<RNTextInput, Props>(TextInput)
