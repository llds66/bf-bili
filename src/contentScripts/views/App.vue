<script setup lang="ts">
import { sendMessage } from 'webext-bridge/content-script'
import 'uno.css'

function openSidepanel() {
  sendMessage('open-sidepanel', {}, 'background')
    .catch(err => console.error('Failed to send open-sidepanel message:', err))
}
</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex items-end  select-none leading-1em">
    <button
      class="box flex w-10 h-10 rounded-full cursor-pointer border-none"
      @click="openSidepanel"
    >
      <div class="i-mingcute-bilibili-line block m-auto  text-lg" />
    </button>
  </div>
</template>

<style scoped>
.box {
  background-color: #fcfcfc;
  transition: background-color 0.3s ease;
}

.box:hover {
  background-color: #eee;
}
</style>
