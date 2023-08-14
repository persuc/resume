
<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import { CONTROL_KEY, LEVELS_PER_PAGE, PAGE_MAJORITY_REQUIRED, THUMBNAIL_KEYCODES } from '@/ts/draw-mode/Config'
import type { LevelSpec } from '@/ts/draw-mode/Level'
import type { Replay, SerialisedReplay } from '@/ts/draw-mode/Replay'
import type { DrawModeState } from '@/ts/draw-mode/State'
import { worlds, type DrawModeNavigation, type WorldData } from '@/ts/draw-mode/World'
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue'

interface Props {
  state: DrawModeState,
  navigation: DrawModeNavigation
}

const { state, navigation } = defineProps<Props>()

const showMenu = ref(false)

onMounted(() => {
  document.addEventListener("keyup", onKeyUp )
  let levelToTest: string = ''
  // Uncomment me during development
  // levelToTest = 'BallOnPlatform'
  const testSpec = worlds.flatMap(w => w.levelSpecs).find(s => s.id === levelToTest)
  if (testSpec) {
    emit('input', testSpec)
  } else if (levelToTest) {
    console.warn(`Test level ${levelToTest} is not a valid level ID`)
  }
})

onUnmounted(() => {
  document.removeEventListener("keyup", onKeyUp )
})

function onKeyUp(e: KeyboardEvent) {
  if (navigation.level) {
    if (e.key === CONTROL_KEY.BACK.code) {
      emit('end')
    }

    if (!navigation.showEndScreen) {
      return
    }

    if (e.key === CONTROL_KEY.FORWARD.code) {
      nextLevel()
    }
  } 
  
  const thumbnailIndex = THUMBNAIL_KEYCODES.indexOf(e.key)
  if (e.key === CONTROL_KEY.BACK.code) {
    if (navigation.world) {
      navigation.world = null
    } else {
      showMenu.value = !showMenu.value
    }
  } else if ([CONTROL_KEY.RIGHT.code, CONTROL_KEY.RIGHT.altCode].includes(e.key)) {
    clickRightArrow()
  } else if ([CONTROL_KEY.LEFT.code, CONTROL_KEY.LEFT.altCode].includes(e.key)) {
    clickLeftArrow()
  } else if (thumbnailIndex >= 0) {
    clickThumbnail(thumbnailIndex + 1)
  }
}

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
  if (navigation.world === null) {
    navigation.worldIdx = navigation.worldPage * LEVELS_PER_PAGE + index - 1
    navigation.world = worlds[navigation.worldIdx]
    navigation.levelPage = 0
    return
  }
  if (!hasPageMajority(navigation.world, navigation.levelPage - 1)) {
    return
  }

  navigation.levelIdx = navigation.levelPage * LEVELS_PER_PAGE + index - 1

  emit('input', navigation.world.levelSpecs[navigation.levelIdx])
}

const showRightArrow = computed(() => {
  if (navigation.world === null) {
    return (LEVELS_PER_PAGE * (navigation.worldPage + 1) < worlds.length)
  }
  return (LEVELS_PER_PAGE * (navigation.levelPage + 1) < navigation.world.levelSpecs.length)
})

function clickLeftArrow() {
  if (navigation.world === null && navigation.worldPage > 0) {
    navigation.worldPage = Math.max(navigation.worldPage - 1, 0)
  } else if (navigation.levelPage > 0) {
    navigation.levelPage = Math.max(navigation.levelPage - 1, 0)
  }
}

function clickRightArrow() {
  if (!showRightArrow.value) return
  if (navigation.world === null) {
    navigation.worldPage += 1
  } else {
    navigation.levelPage += 1
  }
}

function clickBackButton() {
  if (navigation.world !== null) {
    navigation.world = null
  } else {
    showMenu.value = !showMenu.value
  }
}

const nextWorldIdx = computed(() => {
  if (!navigation.world) {
    return -1
  }
  if (navigation.world.levelSpecs.length > navigation.levelIdx + 1) {
    return navigation.worldIdx
  }
  if (worlds.length > navigation.worldIdx + 1) {
    return navigation.worldIdx + 1
  }
  return -1
})

const nextLevelIdx = computed(() => {
  if (!navigation.world) {
    return -1
  }
  if (navigation.world.levelSpecs.length > navigation.levelIdx + 1) {
    return navigation.levelIdx + 1
  }
  if (worlds.length > navigation.worldIdx + 1) {
    return 0
  }
  return -1
})

function nextLevel() {
  if (nextWorldIdx.value !== navigation.worldIdx) {
    if (nextWorldIdx.value >= 0) {
      navigation.worldPage = Math.floor(nextWorldIdx.value / LEVELS_PER_PAGE)
      navigation.world = null
    }
    emit('end')
    return
  }

  const nextSpec = worlds[nextWorldIdx.value].levelSpecs[nextLevelIdx.value]
  navigation.levelIdx = nextLevelIdx.value
  navigation.levelPage = Math.floor(navigation.levelIdx / LEVELS_PER_PAGE)
  emit('end')
  emit('input', nextSpec)
}

const file = ref(null) as unknown as Ref<HTMLInputElement>
async function uploadReplay() {
  const parsed: SerialisedReplay = JSON.parse(await file.value.files![0].text())
  const spec = worlds.flatMap(w => w.levelSpecs).find(l => l.id === parsed.specId)
  if (!spec) {
    return
  }
  emit('replay', {
    lineHistory: parsed.lineHistory,
    spec,
  })
}

const emit = defineEmits<{
  (e: 'input', level: LevelSpec): void,
  (e: 'replay', replay: Replay): void
  (e: 'end'): void
}>()

</script>

<template>
  <div class="ui" v-show="navigation.level === null">
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
      <div v-show="navigation.world !== null" class="pr-4 pl-2 flex items-center">
        <Icon name="chevron-left" class="pr-1" style="height: 1.5rem" />
        <span>BACK TO WORLDS</span>
        <span class="ml-2 keyLabel" style="top: 0.15rem">[{{ CONTROL_KEY.BACK.label }}]</span>
      </div>
      <span v-show="navigation.world === null" class="px-4">{{ showMenu ? 'WORLDS' : 'MENU' }}<span class="ml-2 keyLabel">[{{ CONTROL_KEY.BACK.label }}]</span></span>
    </div>
    <div v-show="!showMenu" class="flex items-center" style="height: 100vh">
      <div
        class="leftArrow flex items-center"
        :style="`
          min-width: 2rem;
          color: ${state.theme.value.TEXT};
          height: 100%;
          `"
        @click="clickLeftArrow"
      >
        <div v-show="navigation.world === null ? (navigation.worldPage > 0) : (navigation.levelPage > 0)">
          <Icon name="chevron-left" style="width: 2rem" />
          <span class="keyLabel" style="top:-1.3em; right:-1.7em">[{{ CONTROL_KEY.LEFT.label }}]</span>
        </div>
      </div>
      <div class="mx-8 my-8" style="grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 2rem; display: grid;">
        <div
          v-for="i in Math.min(LEVELS_PER_PAGE, navigation.world === null ? worlds.length - LEVELS_PER_PAGE * navigation.worldPage : navigation.world.levelSpecs.length - LEVELS_PER_PAGE * navigation.levelPage)"
          :key="`thumbnail-${i}`"
          @click="clickThumbnail(i)"
        >
          <span :style="`color: ${state.theme.value.TEXT}; display: block`">{{ 
            navigation.world === null ? worlds[LEVELS_PER_PAGE * navigation.worldPage + i - 1].name : String(LEVELS_PER_PAGE * navigation.levelPage + i).padStart(3, '0')
           }}{{
            navigation.world !== null && state.completed.has(navigation.world.levelSpecs[LEVELS_PER_PAGE * navigation.levelPage + i - 1].id) ? ' - [Completed]' : ''
            }}
          </span>
          <img
            :src="navigation.world === null ? `/draw-mode/${worlds[LEVELS_PER_PAGE * navigation.worldPage + i - 1].name}/${worlds[LEVELS_PER_PAGE * navigation.worldPage + i - 1].name}.png` : `/draw-mode/${navigation.world.name}/${navigation.world.levelSpecs[LEVELS_PER_PAGE * navigation.levelPage + i - 1].id}.png`"
            :style="`
              width: 100%;
              border: 1pt solid ${state.theme.value.TARGET};
              box-shadow: 6px 6px 0px 0px ${state.theme.value.TARGET};
              opacity: ${navigation.world === null || navigation.levelPage === 0 || hasPageMajority(navigation.world, navigation.levelPage - 1) ? 1 : 0.2}`"
          />
          <span class="pl-1 mb-1 font-bold" :style="`background: ${state.theme.value.TARGET}; color: ${state.theme.value.BACKGROUND}; position: absolute; bottom: 0; right: 0`">
            [{{ CONTROL_KEY[('THUMBNAIL_' + i) as 'THUMBNAIL_1'].label }}]
          </span>
        </div>
      </div>
      <div
        class="rightArrow flex items-center"
        :style="`min-width: 2rem; color: ${state.theme.value.TEXT}; height: 100%;`"
        @click="clickRightArrow"
      >
        <div v-show="showRightArrow">
          <Icon name="chevron-right" style="width: 2rem"  />
          <span class="keyLabel" style="top:-1.2em; right:-1.5em">[{{ CONTROL_KEY.RIGHT.label }}]</span>
        </div>
      </div>
    </div>
    <div style="height: 100vh; margin-left: 4rem; padding-top: 8rem" v-show="showMenu">
      <label for="replay-upload" class="button rounded-none" style="width: fit-content; font-size: 1.25rem;">
        <Icon name="upload" style="width: 2rem" class="mr-2" />Upload Replay
      </label>
      <input ref="file" id="replay-upload" v-on:change="uploadReplay" type="file" style="display: none" />
    </div>
  </div>
  <div
    class="end-screen flex justify-center absolute w-full"
    :style="`top: 5rem; z-index: 2; pointer-events: none; color: ${state.theme.value.TEXT}`"
    v-show="navigation.level !== null "
  >
    <div
      v-show="!navigation.showEndScreen"
      v-html="navigation.level?.text"
      class="px-2 py-1"
      :style="`text-align: center; pointer-events: none; background: ${state.theme.value.BACKGROUND}; max-width: 80vw; font-family: monospace`" />
    <div
      class="px-2"
      v-show="navigation.showEndScreen"
      :style="`pointer-events: none; background: ${state.theme.value.BACKGROUND}`"
    >
      <p style="font-size: 20vh;">Great job.</p>
        <div class="mx-4 mb-4 flex gap-x-4">
          <Button @click="emit('end')" class="pl-2 pr-3 pb-2 h-12 !items-end rounded-none" style="font-size: 1.25rem; pointer-events: all;">
            <Icon name="chevron-left" class="mr-1" style="height: 1.25rem; top: -15%" /><span class="leading-normal uppercase">Back</span><span class="ml-2 keyLabel">[{{ CONTROL_KEY.BACK.label }}]</span>
          </Button>
          <Button @click="nextLevel" class="pl-2 pr-3 pb-2 h-12 !items-end rounded-none" style="font-size: 1.25rem; pointer-events: all;">
            <Icon name="chevron-right" class="mr-1" style="height: 1.25rem; top: -15%" /><span class="leading-normal uppercase">{{ nextWorldIdx === navigation.worldIdx ? 'Next' : 'Next World' }}</span><span class="ml-2 keyLabel">[{{ CONTROL_KEY.FORWARD.label }}]</span>
          </Button>
          <Button @click="navigation.level?.saveReplay" v-show="!navigation.isReplay" class="pl-2 pr-3 pb-2 h-12 !items-end rounded-none" style="font-size: 1.25rem; pointer-events: all;">
            <Icon name="download" class="mr-2 ml-1" style="height: 1.25rem; top: -15%" /><span class="leading-normal uppercase">Save replay</span>
          </Button>
        </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.keyLabel {
  font-family: monospace;
  font-size: 1rem;
}
</style>