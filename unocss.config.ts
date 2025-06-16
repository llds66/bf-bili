import { presetAttributify, presetIcons, presetWind4, transformerDirectives } from 'unocss'
import { defineConfig } from 'unocss/vite'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
  },
})
