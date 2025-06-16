import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const { data: storageDemo, dataReady: storageDemoReady } = useWebExtensionStorage('webext-demo', 'Storage Demo')

// 屏蔽词
export const { data: blockedWords, dataReady: blockedWordsReady } = useWebExtensionStorage<string[]>(
  'blocked-words',
  ['广告', '低俗'],
)

// 屏蔽样式
export const { data: ShieldingStyle, dataReady: ShieldingStyleReady } = useWebExtensionStorage(
  'shielding-style',
  'Vague',
)
