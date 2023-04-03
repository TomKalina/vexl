process.env.TAMAGUI_TARGET = 'native' // Don't forget to specify your TAMAGUI_TARGET here

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'crypto': 'react-native-quick-crypto',
            'node:crypto': 'react-native-quick-crypto',
            // 'crypto': 'crypto-browserify',
            // 'node:crypto': 'crypto-browserify',
            'stream': 'stream-browserify',
            'buffer': '@craftzdog/react-native-buffer',
            'node:buffer': '@craftzdog/react-native-buffer',
            'brorand': '@vexl-next/fix-brorand-for-expo',
          },
        },
      ],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],
      [
        'transform-inline-environment-variables',
        {
          include: 'TAMAGUI_TARGET',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
