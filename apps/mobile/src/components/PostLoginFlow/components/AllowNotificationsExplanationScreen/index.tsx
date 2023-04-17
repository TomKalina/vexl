import {
  HeaderProxy,
  NextButtonProxy,
} from '../../../PageWithButtonAndProgressHeader'
import WhiteContainer from '../../../WhiteContainer'
import SvgImage from '../../../Image'
import {useTranslation} from '../../../../utils/localization/I18nProvider'
import NotificationsSvg from '../../../../images/notificationsSvg'
import {pipe} from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import {getNotificationToken} from '../../../../utils/notifications'
import {Alert} from 'react-native'
import {type PostLoginFlowScreenProps} from '../../../../navigationTypes'
import {useFinishPostLoginFlow} from '../../../../state/postLoginOnboarding'
import {Stack, Text} from 'tamagui'
import useCreateInbox from '../../../../state/chat/hooks/useCreateInbox'
import {useSessionAssumeLoggedIn} from '../../../../state/session'
import reportError from '../../../../utils/reportError'

type Props = PostLoginFlowScreenProps<'AllowNotificationsExplanation'>

function AllowNotificationsExplanationScreen({navigation}: Props): JSX.Element {
  const {t} = useTranslation()
  const createInbox = useCreateInbox()
  const finishPostLoginFlow = useFinishPostLoginFlow()
  const session = useSessionAssumeLoggedIn()

  function onFinished(): void {
    // TODO display loading
    // TODO what if this fails? Use will be stuck on this screen.
    void pipe(
      createInbox({privateKey: session.privateKey}),
      TE.match(
        (e) => {
          if (e._tag === 'ErrorInboxAlreadyExists') {
            finishPostLoginFlow(true)
            return
          }
          reportError('error', 'Error creating inbox', e)
          Alert.alert(t('common.errorCreatingInbox'))
        },
        () => {
          finishPostLoginFlow(true)
        }
      )
    )()
  }

  function allowNotifications(): void {
    void pipe(
      getNotificationToken({shouldAskForPermissions: true}),
      TE.match(
        (l) => {
          switch (l._tag) {
            case 'notificationPermissionDenied':
              Alert.alert(
                t('postLoginFlow.allowNotifications.errors.permissionDenied'),
                undefined,
                [
                  {
                    text: t('common.ok'),
                    onPress: onFinished,
                  },
                ]
              )
              break
            case 'notificationsNotAvailableOnEmulator':
              Alert.alert(
                t(
                  'postLoginFlow.allowNotifications.errors.notAvailableOnEmulator'
                ),
                undefined,
                [
                  {
                    text: t('common.ok'),
                    onPress: onFinished,
                  },
                ]
              )
              break
            default:
              Alert.alert(
                t('postLoginFlow.allowNotifications.errors.unknownError'),
                undefined,
                [
                  {
                    text: t('common.ok'),
                    onPress: onFinished,
                  },
                ]
              )
          }
        },
        (token) => {
          // TODO update stuff with token
          finishPostLoginFlow(true)
        }
      )
    )()
  }

  return (
    <>
      <HeaderProxy showBackButton={true} progressNumber={3} />
      <WhiteContainer>
        <Stack f={1} ai="center" jc="center">
          <SvgImage source={NotificationsSvg} />
        </Stack>
        <Text fos={24} ff="$heading" mt="$4">
          {t('postLoginFlow.allowNotifications.title')}
        </Text>
        <Text mt={16} fos={18} col="$greyOnWhite">
          {t('postLoginFlow.allowNotifications.text')}
        </Text>
      </WhiteContainer>
      <NextButtonProxy
        text={t('postLoginFlow.allowNotifications.action')}
        onPress={allowNotifications}
        disabled={false}
      />
    </>
  )
}

export default AllowNotificationsExplanationScreen
