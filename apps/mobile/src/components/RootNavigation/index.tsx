import InsideScreen from '../InsideRouter'
import LoginFlow from '../LoginFlow'
import {useIsUserLoggedIn} from '../../state/session'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {type RootStackParamsList} from '../../navigationTypes'
import PostLoginFlow from '../PostLoginFlow'
import {useHandlePostLoginFlowRedirect} from './utils'
import TodoScreen from '../TodoScreen'
import OfferDetailScreen from '../OfferDetailScreen'
import ChatDetailScreen from '../ChatDetailScreen'
import TosScreen from '../TosScreen'
import FaqsScreen from '../FaqScreen'

const Stack = createNativeStackNavigator<RootStackParamsList>()

function RootNavigation(): JSX.Element {
  const isLoggedIn = useIsUserLoggedIn()
  useHandlePostLoginFlowRedirect()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      {!isLoggedIn ? (
        <Stack.Screen name={'LoginFlow'} component={LoginFlow} />
      ) : (
        <Stack.Group>
          <Stack.Screen name={'InsideTabs'} component={InsideScreen} />
          <Stack.Screen name={'TodoScreen'} component={TodoScreen} />
          <Stack.Screen name={'PostLoginFlow'} component={PostLoginFlow} />
          <Stack.Screen name={'OfferDetail'} component={OfferDetailScreen} />
          <Stack.Screen name={'ChatDetail'} component={ChatDetailScreen} />
        </Stack.Group>
      )}
      <Stack.Screen name={'TermsAndConditions'} component={TosScreen} />
      <Stack.Screen name={'Faqs'} component={FaqsScreen} />
    </Stack.Navigator>
  )
}

export default RootNavigation
