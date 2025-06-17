import { createApp } from 'vue'
import { onMessage } from 'webext-bridge/content-script'
import { setupApp } from '~/logic/common-setup'
import { blockedWords, blockedWordsReady, shieldingNum, ShieldingStyle, ShieldingStyleReady } from '~/logic/storage'
import App from './views/App.vue'

function shouldBlock(title: string) {
  return blockedWords.value.some(keyword => title.includes(keyword))
}
function addNum() {
  shieldingNum.value++
}

function hideMatchingCards() {
  const cards = document.querySelectorAll<HTMLElement>('.bili-feed-card, .video-card')
  console.log('[屏蔽逻辑] 找到卡片数:', cards.length)
  cards.forEach((card) => {
    if ((card as any).__blocked)
      return

    const titleEl
      = card.querySelector('.bili-video-card__info--tit, .title, .bili-dyn-title')
        || card.querySelector('.video-card__info p')
    const text = titleEl?.textContent?.trim() || ''

    if (titleEl && shouldBlock(text)) {
      const feedCard = card.closest('.feed-card') as HTMLElement | null
      console.log('[屏蔽内容]', text)
      addNum()

      if (ShieldingStyle.value === 'Vague') {
        const el = feedCard || card
        el.style.filter = 'blur(4px) grayscale(100%) opacity(0.3)'
        // el.style.pointerEvents = 'none'
        el.style.userSelect = 'none'
      }
      else if (ShieldingStyle.value === 'Hide') {
        if (feedCard)
          feedCard.style.display = 'none'
        else
          card.remove()
      }
      (card as any).__blocked = true
    }
  })
}

let debounceTimer: NodeJS.Timeout | null = null
const observer = new MutationObserver(() => {
  if (debounceTimer)
    clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    hideMatchingCards()
  }, 300)
})

function startObserver() {
  console.log('[observer] 启动观察')
  const target = document.querySelector('.bili-feed4-layout') || document.body
  observer.observe(target, {
    childList: true,
    subtree: true,
  })
  hideMatchingCards()
}

(async () => {
  console.info('[vitesse-webext] Hello world from content script')

  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })

  // 等待 storage 数据准备完毕
  await Promise.all([
    blockedWordsReady,
    ShieldingStyleReady,
  ])
  console.log('[数据已准备完毕]', blockedWords.value, ShieldingStyle.value)

  // Vue 应用挂载
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container

  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/bf-bili.css'))

  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)

  const app = createApp(App)
  setupApp(app)
  app.mount(root)

  // 启动内容屏蔽逻辑
  startObserver()
})()
