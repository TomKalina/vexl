import {type Atom} from 'jotai'
import {FlatList} from 'react-native'
import {Stack} from 'tamagui'
import atomKeyExtractor from '../../../utils/atomUtils/atomKeyExtractor'
import {type ContactNormalized} from '../brands/ContactNormalized.brand'
import ContactItem from './ContactItem'
import ListFooter from './ListFooter'
import ListHeader from './ListHeader'

interface Props {
  contacts: Array<Atom<ContactNormalized>>
}

function renderItem({item}: {item: Atom<ContactNormalized>}): JSX.Element {
  return <ContactItem contactAtom={item} />
}

function ItemSeparatorComponent(): JSX.Element {
  return <Stack h={16} />
}

function ContactsList({contacts}: Props): JSX.Element {
  return (
    <Stack f={1} bg="$white">
      <Stack pt="$2">
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          data={contacts}
          ItemSeparatorComponent={ItemSeparatorComponent}
          keyExtractor={atomKeyExtractor}
          renderItem={renderItem}
        />
      </Stack>
    </Stack>
  )
}

export default ContactsList
