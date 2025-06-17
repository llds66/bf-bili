<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Tag from 'primevue/tag'

import { ref } from 'vue'

import { blockedWords, shieldingNum, ShieldingStyle } from '~/logic/storage'

const value = ref('')

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
const visible = ref(false)

function addWord(input: string) {
  const words = input
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 0)

  for (const word of words) {
    if (!blockedWords.value.includes(word)) {
      blockedWords.value.push(word)
    }
  }
  value.value = ''
}
function removeWord(word: string) {
  blockedWords.value = blockedWords.value.filter(w => w !== word)
}

const isCopy = ref(false)
function copyMyOptions() {
  const text = blockedWords.value.join(' ')
  navigator.clipboard.writeText(text)
  isCopy.value = true
  setTimeout(() => {
    isCopy.value = false
  }, 1000)
}

function delAll() {
  blockedWords.value = []
}
function openDrawer() {
  value.value = ''
  visible.value = true
}
</script>

<template>
  <div class="w-full h-screen flex flex-col px-4 py-5">
    <main class="flex-1">
      <div class="flex items-center py-3">
        <Logo />
        <div class="flex  flex-1 justify-end">
          <div class="btn-bg-hover" @click="openOptionsPage">
            <div class="i-mingcute-more-1-line text-1rem" />
          </div>
          <a href="https://github.com/llds66/bf-bili" class="btn-bg-hover" @click="openOptionsPage">
            <div class="i-mingcute-github-line text-1rem" />
          </a>
        </div>
      </div>

      <div class="flex flex-col gap-8 mt-4">
        <!-- #1 -->
        <div class="flex gap-5">
          <div class="text-stone-900 text-0.8rem">
            屏蔽样式：
          </div>
          <div class="flex justify-center gap-3">
            <div class="flex items-center gap-1">
              <RadioButton v-model="ShieldingStyle" input-id="Vague" value="Vague" size="small" />
              <label for="Vague">模糊</label>
            </div>
            <div class="flex items-center gap-1">
              <RadioButton v-model="ShieldingStyle" input-id="Hide" value="Hide" size="small" />
              <label for="Hide">隐藏</label>
            </div>
          </div>
        </div>
        <!-- #2 -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-5">
            <div class="text-stone-900 text-0.8rem">
              屏蔽词：
            </div>
            <div class="flex gap-1">
              <InputText v-model="value" type="text" size="small" placeholder="以空格分隔" />
              <Button label="添加" severity="contrast" size="small" @click="addWord(value)" />
            </div>
          </div>
          <div class="flex flex-wrap gap-col-5 gap-row-2 max-h-65vh overflow-auto">
            <Tag v-for="i in blockedWords" :key="i" severity="secondary" :value="i" />
          </div>
          <div class="flex justify-between  gap-2">
            <div class="flex-center text-stone-500 hover:text-stone-950 cursor-pointer" @click="openDrawer">
              <div class="i-mingcute-right-small-line text-lg" />
              屏蔽词管理
            </div>
            <div class="flex-center gap-1 text-stone-400">
              <span>已屏蔽</span>
              <NumberFlow :value="shieldingNum" />
            </div>
            <div class=" text-stone-400">
              标题含有屏蔽词时自动屏蔽
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <span class="flex-center text-sm text-stone-400">@LsAng</span>
    </footer>
    <Drawer v-model:visible="visible" header="屏蔽词管理" class="w-75!">
      <div class="flex flex-col gap-5">
        <div class="flex gap-1">
          <InputText v-model="value" type="text" placeholder="以空格分隔" size="small" />
          <Button label="添加" severity="contrast" size="small" @click="addWord(value)" />
        </div>
        <div class="mx-auto">
          <span v-if="isCopy">已复制！</span>
          <span v-else class=" text-stone-400 hover:text-stone-600 cursor-pointer" @click="copyMyOptions">复制我的配置</span>
          <span class="ml-2 text-stone-400 hover:text-stone-600 cursor-pointer" @click="delAll">一键删除</span>
        </div>
        <div class="flex flex-wrap gap-col-5 gap-row-2">
          <div v-for="i in blockedWords" :key="i" class="flex-center gap-1 rounded-md bg-stone-100 p-1 text-0.8rem">
            <span>{{ i }}</span>
            <div class="i-mingcute-delete-3-line hover:text-red-400" @click="removeWord(i)" />
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<style scoped>
.btn-bg-hover{
  --uno:"p-2 rounded-md hover:bg-#f3f4f7 transition-colors duration-200 dark:hover:bg-#27272a"
}
</style>
