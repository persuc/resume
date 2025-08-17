<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { VexTab as VexTabType, Artist as ArtistType, Vex as VexType } from 'vextab'

// Global references that will be set after script loads
declare global {
  interface Window {
    vextab: {
      default: new (element: HTMLElement) => DivInstance
      VexTab?: new (artist: ArtistType) => VexTabType
      Artist?: new (x: number, y: number, width: number, options: any) => ArtistType
      Vex?: typeof VexType
      Div?: any
    }
  }
}

interface DivInstance {
  redraw(): DivInstance
  parse(): DivInstance
  draw(): DivInstance
}

let VexTab: new (element: HTMLElement) => DivInstance

// Load VexTab from script tag
const loadVexTab = async () => {
  return new Promise<void>((resolve, reject) => {
    if (window.vextab) {
      // Already loaded
      VexTab = window.vextab.default
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '/vextab/div.prod.js'
    script.onload = () => {
      let attempts = 0
      const maxAttempts = 50 // 5 seconds max wait time

      const checkForVexTab = () => {
        attempts++

        if (!window.vextab) {
          if (attempts >= maxAttempts) {
            reject(new Error('VexTab not found on window object'))
            return
          }
          setTimeout(checkForVexTab, 100)
          return
        }

        const vextabModule = window.vextab.default
        if (!vextabModule || typeof vextabModule !== 'function') {
          if (attempts >= maxAttempts) {
            reject(new Error('VexTab constructor not found'))
            return
          }
          setTimeout(checkForVexTab, 100)
          return
        }

        // All dependencies are ready - the Div class handles VexFlow internally
        VexTab = vextabModule
        resolve()
      }

      checkForVexTab()
    }
    script.onerror = () => reject(new Error('Failed to load VexTab script'))
    document.head.appendChild(script)
  })
}

const props = defineProps<{
  value: string
}>()

const canvasRef = ref<HTMLDivElement>()
const errorMessage = ref<string>('')
const isLoaded = ref(false)

const renderTab = async () => {
  if (!canvasRef.value || !isLoaded.value || !VexTab) return

  // Clear previous content
  canvasRef.value.innerHTML = ''
  errorMessage.value = ''

  try {
    // Based on the source, the Div class constructor expects:
    // 1. The element to contain the tab notation as text
    // 2. Width, height, renderer attributes
    // 3. It will clear the element and create the canvas inside it

    canvasRef.value.textContent = props.value
    canvasRef.value.setAttribute('width', '800')
    canvasRef.value.setAttribute('height', '200')
    canvasRef.value.setAttribute('renderer', 'svg')
    canvasRef.value.setAttribute('scale', '1.0')

    const divInstance = new VexTab(canvasRef.value)

    // Check if parsing was successful
    console.log('VexTab Div instance created:', divInstance)

  } catch (e: any) {
    console.error(e)
    errorMessage.value = e.message || 'Failed to render tab'
  }
}

onMounted(async () => {
  await loadVexTab()
  isLoaded.value = true
  renderTab()
})

watch(() => props.value, () => {
  if (isLoaded.value) {
    renderTab()
  }
})
</script>

<template>
  <div>
    <div v-if="errorMessage" class="text-red-500 mb-2">{{ errorMessage }}</div>
    <div v-if="!isLoaded" class="text-gray-500 mb-2">Loading VexTab...</div>
    <div ref="canvasRef" id="canvas"></div>
  </div>
</template>