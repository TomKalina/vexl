import WhiteContainer from '../../../WhiteContainer'
import AnonymizationCaption from '../../../AnonymizationCaption/AnonymizationCaption'
import {useTranslation} from '../../../../utils/localization/I18nProvider'
import {UserNameAndAvatar} from '@vexl-next/domain/src/general/UserNameAndAvatar.brand'
import {
  fromImageUri,
  fromSvgString,
} from '@vexl-next/domain/src/utility/SvgStringOrImageUri.brand'
import {type LoginStackScreenProps} from '../../../../navigationTypes'
import {
  HeaderProxy,
  NextButtonProxy,
} from '../../../PageWithButtonAndProgressHeader'
import {Stack, Text, useMedia} from 'tamagui'
import SelectProfilePicture from '../../../SelectProfilePicture'
import {atom, useAtomValue} from 'jotai'
import {getAvatarSvg} from '../../../AnonymousAvatar'
import randomNumber from '../../../../utils/randomNumber'
import {type UriString} from '@vexl-next/domain/src/utility/UriString.brand'

const selectedImageUriAtom = atom<UriString | undefined>(undefined)

type Props = LoginStackScreenProps<'Photo'>

function PhotoScreen({
  navigation,
  route: {
    params: {userName},
  },
}: Props): JSX.Element {
  const {t} = useTranslation()
  const media = useMedia()
  const selectedImageUri = useAtomValue(selectedImageUriAtom)

  return (
    <>
      <HeaderProxy showBackButton progressNumber={1} />
      <WhiteContainer>
        <Stack maw="70%">
          <Text
            col="$black"
            numberOfLines={media.sm ? 2 : undefined}
            adjustsFontSizeToFit={media.sm}
            ff="$heading"
            fos={24}
          >
            {t('loginFlow.photo.title', {name: userName})}
          </Text>
        </Stack>
        <Stack mt="$4">
          <AnonymizationCaption />
        </Stack>
        <Stack f={1} ai="center" jc="center">
          <SelectProfilePicture selectedImageUriAtom={selectedImageUriAtom} />
        </Stack>
      </WhiteContainer>
      <NextButtonProxy
        disabled={false}
        onPress={() => {
          navigation.navigate('AnonymizationAnimation', {
            realUserData: UserNameAndAvatar.parse({
              userName,
              image: selectedImageUri
                ? fromImageUri(selectedImageUri)
                : fromSvgString(getAvatarSvg(randomNumber(0, 3))),
            }),
          })
        }}
        text={t('common.continue')}
      />
    </>
  )
}

export default PhotoScreen
