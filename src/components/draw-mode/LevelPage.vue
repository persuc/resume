
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { LEVELS_PER_PAGE, PAGE_MAJORITY_REQUIRED } from '@/ts/draw-mode/Config'
import type { LevelSpec } from '@/ts/draw-mode/Level'
import type { DrawModeState } from '@/ts/draw-mode/State'
import { themes } from '@/ts/draw-mode/Theme'
import BalancedBetweenSticks from '@/ts/draw-mode/levels/BalancedBetweenSticks'
import BallBesideHill from '@/ts/draw-mode/levels/BallBesideHill'
import BallInCup from '@/ts/draw-mode/levels/BallInCup'
import BallOnCube from '@/ts/draw-mode/levels/BallOnCube'
import BallOnFloor from '@/ts/draw-mode/levels/BallOnFloor'
import BallOnRope from '@/ts/draw-mode/levels/BallOnRope'
import BallOnStilts from '@/ts/draw-mode/levels/BallOnStilts'
import BallUnderClutter from '@/ts/draw-mode/levels/BallUnderClutter'
import Chasm from '@/ts/draw-mode/levels/Chasm'
import NoDrawAfterAwaken from '@/ts/draw-mode/levels/NoDrawAfterAwaken'
import NoDrawOverhang from '@/ts/draw-mode/levels/NoDrawOverhang'
import NoDrawRamp from '@/ts/draw-mode/levels/NoDrawRamp'
import NoDrawRampTarget from '@/ts/draw-mode/levels/NoDrawRampTarget'
import SleepingBall from '@/ts/draw-mode/levels/SleepingBall'
import Slot from '@/ts/draw-mode/levels/Slot'
import SlotNoDraw from '@/ts/draw-mode/levels/SlotNoDraw'
import TargetBehindL from '@/ts/draw-mode/levels/TargetBehindL'
import Windmill from '@/ts/draw-mode/levels/Windmill'
import level from '@/ts/draw-mode/levels/BalancedBetweenSticks'

interface Props {
  state: DrawModeState,
}

const { state } = defineProps<Props>()

const worldPage = ref(0)
const levelPage = ref(0)
const world: Ref<WorldData | null> = ref(null)

type WorldData = {
  name: string,
  levelSpecs: LevelSpec[]
}

const createWorldData = (name: string, levelSpecs: LevelSpec[]): WorldData => {
  return {
    name: name,
    levelSpecs,
  }
}
const worlds = [
  createWorldData('begin', [
    BallOnCube, BallOnFloor, BallInCup, NoDrawOverhang, BallBesideHill, BallUnderClutter,
    BallOnRope, NoDrawRamp, NoDrawRampTarget, SleepingBall, NoDrawAfterAwaken, Windmill,
    Slot, SlotNoDraw, Chasm, TargetBehindL, BallOnStilts, BalancedBetweenSticks
  ]),
  createWorldData('bloom', []),
  createWorldData('flourish', []),
  createWorldData('burn', []),
]

// const worldImages: (HTMLImageElement | null)[] = new Array(worlds.length).fill(null)

// Math.min(LEVELS_PER_PAGE, images.length - page * LEVELS_PER_PAGE)

// async function fetchImages(images: (HTMLImageElement | null)[], paths: string[], start: number) {
//   const promises: Promise<HTMLImageElement>[] = []
//   const end = Math.min(start + LEVELS_PER_PAGE, images.length)
//   for (let i = start; i < end; i++) {
//     const existingImage = images[i]
//     if (existingImage !== null) {
//       promises.push(Promise.resolve(existingImage))
//     } else {
//       const image = new Image()
//       promises.push(new Promise((resolve, reject) => {
//         image.onload = () => {
//           images[i] = image
//           resolve(image)
//         }
//         image.onerror = reject
//       }))
//       image.src = `/draw-mode/${paths[i]}.png`
//     }
//   }

//   return Promise.all(promises)
// }

onMounted(() => {
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

const emit = defineEmits<{
  (e: 'input', level: LevelSpec): void
}>()

</script>

<template>
  <div class="level-page">
    <div class="flex center" :style="`
        background: ${state.theme.value.TEXT};
        color: ${state.theme.value.BACKGROUND};
        font-size: 1.5rem;
        padding: 0.2rem 1rem 0.2rem 0.5rem;
        position: absolute;
        top: 2rem;
        z-index: 2;
      `"
      v-show="world !== null"
      @click="() => world = null"
    >
      <Icon name="chevron-left" class="pr-1" style="width: 1.75rem" />
      BACK TO WORLDS
    </div>
    <div class="flex center" style="height: 100vh">
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
              border: 1pt solid ${state.theme.value.TEXT};
              box-shadow: 6px 6px 0px 0px ${state.theme.value.DRAW};
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
  </div>
</template>