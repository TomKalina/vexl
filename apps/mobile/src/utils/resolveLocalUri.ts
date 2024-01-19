import {UriString} from '@vexl-next/domain/src/utility/UriString.brand'
import {cacheDirectory, documentDirectory} from 'expo-file-system'
import {Platform} from 'react-native'

export default function resolveLocalUri(uri: UriString): UriString {
  if (Platform.OS === 'android') return uri

  if (!uri.startsWith('file://')) {
    return uri
  }

  if (!cacheDirectory || !documentDirectory) return uri

  const replaced = uri
    .replace(
      /file:\/\/\/.*?Containers\/Data\/Application\/[A-Z0-9-]+\/Documents\//,
      documentDirectory ?? ''
    )
    .replace(
      /file:\/\/\/.*?Containers\/Data\/Application\/[A-Z0-9-]+\/Library\/Caches\//,
      cacheDirectory ?? ''
    )

  const parsed = UriString.safeParse(replaced)
  if (!parsed.success) return uri
  return parsed.data
}
