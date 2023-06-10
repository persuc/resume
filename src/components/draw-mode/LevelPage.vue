
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { LEVELS_PER_PAGE, PAGE_MAJORITY_REQUIRED } from '@/ts/draw-mode/Config'
import type { LevelSpec, Replay } from '@/ts/draw-mode/Level'
import type { DrawModeState } from '@/ts/draw-mode/State'
import { worlds, type WorldData } from '@/ts/draw-mode/World'

interface Props {
  state: DrawModeState,
}

const { state } = defineProps<Props>()

const worldPage = ref(0)
const levelPage = ref(0)
const world: Ref<WorldData | null> = ref(null)
const showMenu = ref(false)

onMounted(() => {
  // Uncomment me during development
  // emit('input', BallOnPlatform)
})

function hasPageMajority(world: WorldData, page: number): boolean {
  if (page < 0 || state.unlockAllLevels.value) {
    return true
  }
  return world.levelSpecs
    .slice(page * LEVELS_PER_PAGE, (page + 1) * LEVELS_PER_PAGE)
    .reduce((acc, levelSpec) => state.completed.has(levelSpec.id) ? acc + 1 : acc, 0)
    > PAGE_MAJORITY_REQUIRED
}

function clickThumbnail(index: number) {
  if (world.value === null) {
    world.value = worlds[worldPage.value * LEVELS_PER_PAGE + index - 1]
    levelPage.value = 0
    return
  }
  if (!hasPageMajority(world.value, levelPage.value - 1)) {
    return
  }

  emit('input', world.value.levelSpecs[levelPage.value * LEVELS_PER_PAGE + index - 1])
}

const showRightArrow = computed(() => {
  if (world.value === null) {
    return (LEVELS_PER_PAGE * (worldPage.value + 1) < worlds.length)
  }
  return (LEVELS_PER_PAGE * (levelPage.value + 1) < world.value.levelSpecs.length)
})

function clickLeftArrow() {
  if (world.value === null && worldPage.value > 0) {
    worldPage.value -= 1
  } else if (levelPage.value > 0) {
    levelPage.value -= 1
  }
}

function clickBackButton() {
  if (world.value !== null) {
    world.value = null
  } else {
    showMenu.value = !showMenu.value
  }
}

const file = ref(null) as unknown as Ref<HTMLInputElement>
async function uploadReplay() {
  emit('replay', JSON.parse(await file.value.files![0].text()))
}

const emit = defineEmits<{
  (e: 'input', level: LevelSpec): void,
  (e: 'replay', replay: Replay): void
}>()

</script>

<template>
  <div class="level-page">
    <div class="py-1" :style="`
        background: ${state.theme.value.TEXT};
        color: ${state.theme.value.BACKGROUND};
        font-size: 1.5rem;
        position: absolute;
        top: 2rem;
        z-index: 2;
        cursor: pointer;
      `"
      @click="clickBackButton"
    >
      <div v-show="world !== null" class="pr-4 pl-2 flex center">
        <Icon name="chevron-left" class="pr-1" style="width: 1.75rem" />
        <span >BACK TO WORLDS</span>
      </div>
      <span v-show="world === null" class="px-4">{{ showMenu ? 'WORLDS' : 'MENU' }}</span>
    </div>
    <div v-show="!showMenu" class="flex center" style="height: 100vh">
      <div
        class="leftArrow flex center"
        :style="`
          min-width: 2rem;
          color: ${state.theme.value.TEXT};
          height: 100%;
          `"
        @click="clickLeftArrow"
      >
        <Icon name="chevron-left" style="width: 2rem" v-show="world === null ? (worldPage > 0) : (levelPage > 0)" />
      </div>
      <div class="mx-8 my-8" style="grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 2rem; display: grid;">
        <div
          v-for="i in Math.min(LEVELS_PER_PAGE, world === null ? worlds.length - LEVELS_PER_PAGE * worldPage : world.levelSpecs.length - LEVELS_PER_PAGE * levelPage)"
          :key="`thumbnail-${i}`"
          @click="clickThumbnail(i)"
        >
          <span :style="`color: ${state.theme.value.TEXT}; display: block`">{{ 
            world === null ? worlds[LEVELS_PER_PAGE * worldPage + i - 1].name : String(LEVELS_PER_PAGE * levelPage + i).padStart(3, '0')
           }}{{
            world !== null && state.completed.has(world.levelSpecs[LEVELS_PER_PAGE * levelPage + i - 1].id) ? ' - [Completed]' : ''
            }}
          </span>
          <img
            :src="world === null ? `/draw-mode/${worlds[LEVELS_PER_PAGE * worldPage + i - 1].name}/${worlds[LEVELS_PER_PAGE * worldPage + i - 1].name}.png` : `/draw-mode/${world.name}/${world.levelSpecs[LEVELS_PER_PAGE * levelPage + i - 1].id}.png`"
            :style="`
              width: 100%;
              border: 1pt solid ${state.theme.value.TARGET};
              box-shadow: 6px 6px 0px 0px ${state.theme.value.TARGET};
              opacity: ${world === null || levelPage === 0 || hasPageMajority(world, levelPage - 1) ? 1 : 0.2}`"
          /> 
        </div>
      </div>
      <div
        class="rightArrow flex center"
        :style="`min-width: 2rem; color: ${state.theme.value.TEXT}; height: 100%;`"
        @click="() => {if (!showRightArrow) return; world === null ? worldPage += 1 : levelPage += 1}"
      >
        <Icon name="chevron-right" style="width: 2rem" v-show="showRightArrow" />
      </div>
    </div>
    <div style="height: 100vh; margin-left: 4rem; padding-top: 8rem" v-show="showMenu">
      <label for="replay-upload" class="button br-0" style="width: fit-content; font-size: 1.25rem;">
        <Icon name="upload" style="width: 2rem" class="mr-2" />Upload Replay
      </label>
      <input ref="file" id="replay-upload" v-on:change="uploadReplay" type="file" style="display: none" />
    </div>
  </div>
</template>