import {useNavigation, type NavigationProp} from '@react-navigation/native'
import {useAtomValue} from 'jotai'
import {useCallback} from 'react'
import {type TradeChecklistStackParamsList} from '../../../../../navigationTypes'
import {tradeChecklistLocationDataAtom} from '../../../../../state/tradeChecklist/atoms/fromChatAtoms'
import * as MeetingLocation from '../../../../../state/tradeChecklist/utils/location'
import {tradeChecklistWithUpdatesMergedAtom} from '../../../atoms/updatesToBeSentAtom'
import ChecklistCell from './ChecklistCell'

function MeetingLocationCell(): JSX.Element {
  const navigation: NavigationProp<TradeChecklistStackParamsList> =
    useNavigation()

  const nextChecklistData = useAtomValue(tradeChecklistWithUpdatesMergedAtom)
  const tradeChecklistLocationData = useAtomValue(
    tradeChecklistLocationDataAtom
  )

  const onPress = useCallback(() => {
    const pendingSuggestion = MeetingLocation.getPendingSuggestion(
      tradeChecklistLocationData
    )
    if (pendingSuggestion?.by === 'them') {
      navigation.navigate('LocationMapPreview', {
        selectedLocation: pendingSuggestion.data.data,
      })
    } else {
      navigation.navigate('LocationSearch')
    }
  }, [navigation, tradeChecklistLocationData])

  return (
    <ChecklistCell
      item="MEETING_LOCATION"
      subtitle={MeetingLocation.getSubtitle(nextChecklistData.location)}
      onPress={onPress}
    />
  )
}

export default MeetingLocationCell
