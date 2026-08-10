<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  prepareSource,
  hideRests,
  hideMutedNoteheads,
  loadVexTab,
  configureCanvas,
  DEFAULT_TEMPO,
  type DivInstance,
  type DivConstructor
} from '@/ts/vextab'
import { buildSchedule, TabPlayer, type ScheduledNote } from '@/ts/tab-audio'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  'parse-error': [message: string]
}>()

const canvasRef = ref<HTMLDivElement>()
const stageRef = ref<HTMLDivElement>()
const loadError = ref('')
const isLoaded = ref(false)

const schedule = ref<ScheduledNote[]>([])
const cursor = ref(-1)
const isPlaying = ref(false)
const tempo = ref(DEFAULT_TEMPO)

let div: DivInstance | null = null
const player = new TabPlayer()

player.onStep = (index) => {
  cursor.value = index
}
player.onEnd = () => {
  isPlaying.value = false
}

const playhead = computed(() => {
  const note = schedule.value[cursor.value]
  if (!note) return null

  return {
    left: `${note.x}px`,
    top: `${note.y}px`,
    height: `${note.height}px`
  }
})

const renderTab = () => {
  if (!div) return

  const { code, hiddenRests } = prepareSource(props.value)

  if (!code.trim()) {
    stopPlayback()
    div.ctx.clear()
    schedule.value = []
    cursor.value = -1
    emit('parse-error', '')
    return
  }

  try {
    div.artist.reset()
    div.parser.reset()
    div.parser.parse(code)
  } catch (e: any) {
    emit('parse-error', e?.message || 'Invalid tab notation')
    return
  }

  emit('parse-error', '')
  if (!div.parser.isValid()) return

  stopPlayback()
  div.artist.draw(div.renderer)
  hideRests(div.artist, hiddenRests)
  hideMutedNoteheads(div.artist)

  tempo.value = Number(div.artist.customizations.tempo) || DEFAULT_TEMPO
  schedule.value = buildSchedule(div.artist, tempo.value)
  cursor.value = schedule.value.length ? 0 : -1
}

function play() {
  if (!schedule.value.length) return

  const from = cursor.value >= 0 ? cursor.value : 0
  player.play(schedule.value, from >= schedule.value.length - 1 ? 0 : from)
  isPlaying.value = true
}

function stopPlayback() {
  player.stop()
  isPlaying.value = false
}

function toggle() {
  if (isPlaying.value) stopPlayback()
  else play()
}

function seek(event: MouseEvent) {
  const stage = stageRef.value
  if (!stage || !schedule.value.length) return

  const bounds = stage.getBoundingClientRect()
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top

  let index = 0
  let closestBand = Infinity
  let closestX = Infinity

  for (let i = 0; i < schedule.value.length; i++) {
    const note = schedule.value[i]

    const band =
      y < note.y ? note.y - y : y > note.y + note.height ? y - note.y - note.height : 0
    const distance = Math.abs(note.x - x)

    if (band < closestBand || (band === closestBand && distance < closestX)) {
      index = i
      closestBand = band
      closestX = distance
    }
  }

  cursor.value = index

  if (isPlaying.value) player.play(schedule.value, index)
}

onMounted(async () => {
  let VexTabDiv: DivConstructor
  try {
    VexTabDiv = await loadVexTab()
  } catch (e: any) {
    loadError.value = e?.message || 'Failed to load VexTab'
    return
  }

  const el = canvasRef.value
  if (!el) return

  configureCanvas(el)

  try {
    div = new VexTabDiv(el)
  } catch (e: any) {
    loadError.value = e?.message || 'Failed to initialise VexTab'
    return
  }

  isLoaded.value = true
  renderTab()
})

onBeforeUnmount(() => {
  player.dispose()
})

watch(() => props.value, renderTab)

function getSvg(): SVGSVGElement | null {
  return canvasRef.value?.querySelector('svg') ?? null
}

defineExpose({
  toggle,
  stop: stopPlayback,
  getSvg,
  tempo,
  isPlaying,
  hasAudio: computed(() => schedule.value.length > 0)
})
</script>

<template>
  <div>
    <div v-if="loadError" class="text-red-500 mb-2">{{ loadError }}</div>
    <div v-else-if="!isLoaded" class="text-gray-500 mb-2">Loading VexTab...</div>

    <div v-if="schedule.length" class="mb-3 text-sm text-gray-700">
      <span class="text-lg leading-none align-middle">&#9833;</span> = {{ tempo }}
    </div>

    <div ref="stageRef" tabindex="0" class="relative focus:outline-none"
      :class="{ 'cursor-pointer': schedule.length }" @click="seek" @keydown.space.prevent="toggle">
      <div ref="canvasRef" id="canvas"></div>

      <div v-if="playhead" class="absolute w-0 pointer-events-none" :style="playhead">
        <div class="absolute inset-y-0 -left-px w-0.5 bg-blue-500"></div>
        <div
          class="absolute -top-2 -left-[6px] w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-blue-500">
        </div>
      </div>
    </div>
  </div>
</template>
