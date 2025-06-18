import { createApp } from 'vue'
import { onMessage } from 'webext-bridge/content-script'
import { setupApp } from '~/logic/common-setup'
import {
  blockedUPs,
  blockedUPsReady,
  blockedWords,
  blockedWordsReady,
  shieldingNum,
  ShieldingStyle,
  ShieldingStyleReady,
} from '~/logic/storage'
import App from './views/App.vue'

// 判断视频标题是否包含屏蔽关键词
function shouldBlock(title: string) {
  return blockedWords.value.some(keyword => title.includes(keyword))
}

// 判断UP主名是否在屏蔽列表中
function shouldBlockByAuthor(author: string) {
  return blockedUPs.value.some(name => author.includes(name))
}

// 增加被屏蔽视频数量
function addNum() {
  shieldingNum.value++
}

// 核心：查找卡片并根据标题或作者进行屏蔽
function hideMatchingCards() {
  const cards = document.querySelectorAll<HTMLElement>('.bili-feed-card, .video-card')
  console.log('[屏蔽逻辑] 找到卡片数:', cards.length)

  cards.forEach((card) => {
    if ((card as any).__blocked)
      return

    // 获取标题
    const titleEl
      = card.querySelector('.bili-video-card__info--tit, .title, .bili-dyn-title')
        || card.querySelector('.video-card__info p')
    const text = titleEl?.textContent?.trim() || ''

    // 获取作者
    const authorEl
      = card.querySelector('.bili-video-card__info--author, .up-name__text')
    const author = authorEl?.textContent?.trim() || ''

    // 判断是否需要屏蔽
    if ((text && shouldBlock(text)) || (author && shouldBlockByAuthor(author))) {
      const feedCard = card.closest('.feed-card') as HTMLElement | null
      console.log('[屏蔽内容]', { text, author })
      addNum()

      if (ShieldingStyle.value === 'Vague') {
        const el = feedCard || card
        el.style.filter = 'blur(4px) grayscale(100%) opacity(0.3)'
        el.style.userSelect = 'none'
      }
      else if (ShieldingStyle.value === 'Hide') {
        if (feedCard)
          feedCard.style.display = 'none'
        else
          card.remove()
      }

      // 标记已处理
      (card as any).__blocked = true
    }
  })
}

// DOM 变化监听（节流处理）
let debounceTimer: NodeJS.Timeout | null = null
const observer = new MutationObserver(() => {
  if (debounceTimer)
    clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    hideMatchingCards()
  }, 300)
})

// 启动监听器
function startObserver() {
  console.log('[observer] 启动观察')
  const target = document.querySelector('.bili-feed4-layout') || document.body
  observer.observe(target, {
    childList: true,
    subtree: true,
  })
  hideMatchingCards()
}

// 主流程启动
(async () => {
  console.info('[vitesse-webext] Hello world from content script')

  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })

  // 等待 storage 数据准备完毕
  await Promise.all([
    blockedWordsReady,
    blockedUPsReady,
    ShieldingStyleReady,
  ])
  console.log('[数据已准备完毕]', {
    blockedWords: blockedWords.value,
    blockedUPs: blockedUPs.value,
    style: ShieldingStyle.value,
  })

  // Vue 应用挂载（显示统计信息或设置入口）
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
