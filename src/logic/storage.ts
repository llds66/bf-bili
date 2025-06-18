import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const { data: storageDemo, dataReady: storageDemoReady } = useWebExtensionStorage('webext-demo', 'Storage Demo')

// 屏蔽词
export const { data: blockedWords, dataReady: blockedWordsReady } = useWebExtensionStorage<string[]>(
  'blocked-words',
  [],
)

// 屏蔽UP
export const { data: blockedUPs, dataReady: blockedUPsReady } = useWebExtensionStorage<string[]>(
  'blocked-UPs',
  [],
)

// 屏蔽样式
export const { data: ShieldingStyle, dataReady: ShieldingStyleReady } = useWebExtensionStorage(
  'shielding-style',
  'Vague',
)

// 屏蔽数量
export const { data: shieldingNum, dataReady: shieldingNumReady } = useWebExtensionStorage<number>(
  'shielding-num',
  0,
)
