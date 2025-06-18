<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'

import { ref } from 'vue'

import { blockedUPs, blockedWords, shieldingNum, ShieldingStyle } from '~/logic/storage'

const blockWord = ref('') // 屏蔽词
const blockUP = ref('') // 屏蔽UP
const nowBlockType = ref<0 | 1>(0) // 0 屏蔽词; 1 屏蔽UP

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
const visible = ref(false)

function addWord(input: string, type: 0 | 1) {
  const words = input
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 0)

  for (const word of words) {
    if (type === 0) {
      if (!blockedWords.value.includes(word)) {
        blockedWords.value.push(word)
        blockWord.value = ''
      }
    }
    if (type === 1) {
      if (!blockedUPs.value.includes(word)) {
        blockedUPs.value.push(word)
        blockUP.value = ''
      }
    }
  }
}

function removeWord(word: string, type: 0 | 1) {
  if (type === 0) {
    blockedWords.value = blockedWords.value.filter(w => w !== word)
  }
  else {
    blockedUPs.value = blockedUPs.value.filter(w => w !== word)
  }
}

const isCopy = ref(false)
function copyMyOptions(type: 0 | 1) {
  let text = ''
  if (type === 0) {
    text = blockedWords.value.join(' ')
  }
  else {
    text = blockedUPs.value.join(' ')
  }
  navigator.clipboard.writeText(text)
  isCopy.value = true
  setTimeout(() => {
    isCopy.value = false
  }, 1000)
}

function delAll(type: 0 | 1) {
  if (type === 0) {
    blockedWords.value = []
  }
  else {
    blockedUPs.value = []
  }
}

function openDrawer(type: 0 | 1) {
  nowBlockType.value = type
  blockWord.value = ''
  blockUP.value = ''
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

      <div class="flex flex-col gap-10 mt-4">
        <!-- #1 屏蔽样式 -->
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
        <!-- #2 屏蔽词 -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-5">
            <div class="text-stone-900 text-0.8rem">
              屏蔽词：
            </div>
            <div class="flex gap-1">
              <InputText v-model="blockWord" type="text" size="small" placeholder="以空格分隔" />
              <Button label="添加" severity="contrast" size="small" @click="addWord(blockWord, 0)" />
            </div>
          </div>
          <div class="flex justify-between  gap-2">
            <div class="flex-center text-stone-500 hover:text-stone-950 cursor-pointer" @click="openDrawer(0)">
              <div class="i-mingcute-right-small-line text-lg" />
              屏蔽词管理
            </div>
            <div class=" text-stone-400">
              标题含有屏蔽词时屏蔽
            </div>
          </div>
        </div>
        <!-- #3 屏蔽up  -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-5">
            <div class="text-stone-900 text-0.8rem">
              屏蔽UP：
            </div>
            <div class="flex gap-1">
              <InputText v-model="blockUP" type="text" size="small" placeholder="以空格分隔" />
              <Button label="添加" severity="contrast" size="small" @click="addWord(blockUP, 1)" />
            </div>
          </div>
          <div class="flex justify-between  gap-2">
            <div class="flex-center text-stone-500 hover:text-stone-950 cursor-pointer" @click="openDrawer(1)">
              <div class="i-mingcute-right-small-line text-lg" />
              屏蔽UP管理
            </div>
            <div class=" text-stone-400">
              屏蔽UP视频
            </div>
          </div>
        </div>
        <!-- #4 统计  -->
        <div class="flex-center gap-1 text-stone-400">
          <span>已屏蔽</span>
          <NumberFlow :value="shieldingNum" />
        </div>
      </div>
    </main>
    <!-- Footer -->
    <footer>
      <span class="flex-center text-sm text-stone-400">@LsAng</span>
    </footer>
    <!-- Drawer -->
    <Drawer
      v-model:visible="visible"
      :header="nowBlockType === 0 ? '屏蔽词管理' : '屏蔽UP管理'"
      class="w-75!"
    >
      <div class="flex flex-col gap-5">
        <div v-if="nowBlockType === 0" class="flex gap-1">
          <InputText v-model="blockWord" type="text" placeholder="以空格分隔" size="small" />
          <Button label="添加" severity="contrast" size="small" @click="addWord(blockWord, nowBlockType)" />
        </div>
        <div v-if="nowBlockType === 1" class="flex gap-1">
          <InputText v-model="blockUP" type="text" placeholder="以空格分隔" size="small" />
          <Button label="添加" severity="contrast" size="small" @click="addWord(blockUP, nowBlockType)" />
        </div>
        <div class="mx-auto">
          <span v-if="isCopy">已复制！</span>
          <span v-else class=" text-stone-400 hover:text-stone-600 cursor-pointer" @click="copyMyOptions(nowBlockType)">复制我的配置</span>
          <span class="ml-2 text-stone-400 hover:text-stone-600 cursor-pointer" @click="delAll(nowBlockType)">一键删除</span>
        </div>
        <div v-if="nowBlockType === 0" class="flex flex-wrap gap-col-5 gap-row-2">
          <div v-for="i in blockedWords" :key="i" class="flex-center gap-1 rounded-md bg-stone-100 p-1 text-0.8rem">
            <span>{{ i }}</span>
            <div class="i-mingcute-delete-3-line hover:text-red-400" @click="removeWord(i, nowBlockType)" />
          </div>
        </div>
        <div v-else class="flex flex-wrap gap-col-5 gap-row-2">
          <div v-for="i in blockedUPs" :key="i" class="flex-center gap-1 rounded-md bg-stone-100 p-1 text-0.8rem">
            <span>{{ i }}</span>
            <div class="i-mingcute-delete-3-line hover:text-red-400" @click="removeWord(i, nowBlockType)" />
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
