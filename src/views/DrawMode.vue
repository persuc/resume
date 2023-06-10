<script setup lang="ts">
  import LevelPage from '@/components/draw-mode/LevelPage.vue'
import Icon from '@/components/Icon.vue'
import { ASPECT_RATIO, CLEANUP_INTERVAL } from '@/ts/draw-mode/Config'
import { cleanupEndConditions } from '@/ts/draw-mode/EndCondition'
import { createLevel, type Level, type LevelSpec } from '@/ts/draw-mode/Level'
import { ReplayPlayer, type Replay } from '@/ts/draw-mode/Replay'
import { createState } from '@/ts/draw-mode/State'
import { themes, type Theme } from '@/ts/draw-mode/Theme'
import Matter, { Common, Composite, Engine, Events, Mouse, Render, Runner } from 'matter-js'
import decomp from 'poly-decomp'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
  
  const showEndScreen = ref(false)
  const state = createState()
  let timeOfLastCleanup = 0
  let returnToLevelSelectTimeouts: number[] = []
  const isReplay = ref(false)
  const replayPlayer = ReplayPlayer

  Common.setDecomp(decomp)

  const engine = Engine.create()
  let render: Matter.Render // created on load
  const runner = Runner.create()

  const container: Ref<HTMLElement> = ref() as Ref<HTMLElement>

  let level: Ref<Level | null> = ref(null)
  let mouse: Mouse

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault()
    } else if (e.key === 'r') {
      if (level.value && !showEndScreen.value) {
        if (isReplay.value) {
          replayPlayer.stop()
          const replay = replayPlayer.getReplay()
          resetEngine()
          if (replay) {
            startReplay(replay)
          }
        } else {
          level.value.restart()
        }
      }
    } else if (e.key === 't') {
      const themesValues = Object.values(themes)
      const themeIdx = themesValues.findIndex(theme => state.theme.value === theme)
      applyTheme(themesValues[(themeIdx + 1) % themesValues.length])
    } else if (e.key === 'Escape') {
      if (isReplay.value) {
        endReplay()
      } else {
        returnToLevelSelect()
      }
    }
  }
  function startDrawing(e: MouseEvent) {
    if (e.target !== render.canvas || showEndScreen.value || isReplay.value) {
      return
    }
    if (level.value) {
      level.value.startLine().addPoint(render.mouse.position)
    }
  }
  function draw(e: MouseEvent) {
    if (e.target === render.canvas && level.value && !isReplay.value) {
      level.value.drawLine(render.mouse.position)
    }
  }
  function stopDrawing() {
    if (level.value && !isReplay.value) {
      level.value.endLine()
    }
  }
  function applyTheme(theme: Theme) {
    state.theme.value = theme
    render.canvas.style.background = theme.BACKGROUND
    if (level.value !== null) {
      level.value.applyTheme(theme)
    }
    state.save()
  }

  function onResize() {
    const canvas: HTMLCanvasElement = render.canvas
    // const div: HTMLElement = render.canvas.parentElement!
    const aspect = window.innerWidth / window.innerHeight
    if (aspect > ASPECT_RATIO) {
      render.options.width = window.innerHeight * ASPECT_RATIO
      render.options.height = window.innerHeight
      container.value.style.width = `${window.innerHeight * ASPECT_RATIO}px`
      container.value.style.height = `${window.innerHeight}px`
    } else {
      render.options.width = window.innerWidth
      render.options.height = window.innerWidth / ASPECT_RATIO
      container.value.style.width = `${window.innerWidth}px`
      container.value.style.height = `${window.innerWidth / ASPECT_RATIO}px`
    }
    canvas.width = render.options.width
    canvas.height = render.options.height
  }

  onMounted(() => {
    document.addEventListener("keyup", onKeyUp )
    document.addEventListener("mousemove", draw )
    document.addEventListener("mouseup", stopDrawing )
    document.addEventListener("mousedown", startDrawing )
    window.addEventListener("resize", onResize)
    state.load()
    render = Render.create({
        element: document.getElementById('render')!,
        engine: engine,
        options: {
          // showMousePosition: true,
          wireframes: false,
          // showBounds: true,
          hasBounds: true
        },
    })

    onResize()

    mouse = Matter.Mouse.create(render.canvas)
    render.mouse = mouse

    Render.run(render)
    Runner.run(runner, engine)
    Events.on(engine, 'afterUpdate', cleanup)

    applyTheme(state.theme.value);

    (window as any)['unlockAllLevels'] = () => {
      state.unlockAllLevels.value = true
      state.save()
      console.info("All levels unlocked!")
    }
  })

  function startLevel(spec: LevelSpec) {
    level.value = createLevel(engine, spec, state.theme.value, () => {
      showEndScreen.value = true
      if (level.value?.line) {
        level.value.endLine()
      }
      state.completed.add(spec.id)
      state.save()
      // returnToLevelSelectTimeouts.push(setTimeout(returnToLevelSelect, 3000))
    })
  }

  function returnToLevelSelect() {
    if (!level.value) {
      return
    }

    if (level.value.line) {
      level.value.endLine()
    }

    resetEngine()
  }

  function resetEngine() {
    showEndScreen.value = false
    Composite.clear(engine.world, false)
    cleanupEndConditions(engine)
    level.value = null
    while (returnToLevelSelectTimeouts.length) {
      clearTimeout(returnToLevelSelectTimeouts.pop())
    }
  }

  function cleanup() {
    const time = Date.now()
    if (time - timeOfLastCleanup >= CLEANUP_INTERVAL) {
      timeOfLastCleanup = time
      if (!level.value) {
        return
      }
      const bodies = Composite.allBodies(engine.world)
      if (bodies.length < 10) {
        return
      }
      for (const body of bodies) {
        if (body.position.x < -1000 || body.position.x > 1000 || body.position.y > 1000 || body.position.y < -1000) {
          Composite.remove(engine.world, body)
        }
      }
    }
  }

  function startReplay(replay: Replay) {
    isReplay.value = true
  
    level.value = createLevel(engine, replay.spec, state.theme.value, () => {
      showEndScreen.value = true
    })

    replayPlayer.start(replay, level)
    
    Events.on(engine, 'afterUpdate', replayPlayer.render)
  }

  function endReplay() {
    isReplay.value = false
    Events.off(engine, 'afterUpdate', replayPlayer.render)
    returnToLevelSelect()
  }

  onUnmounted(() => {
    document.removeEventListener("keyup", onKeyUp)
    document.removeEventListener("mousemove", draw)
    document.removeEventListener("mouseup", stopDrawing)
    document.removeEventListener("mousedown", startDrawing)
    Events.off(engine, 'afterUpdate', cleanup)
    Engine.clear(engine);
    Render.stop(render);
    Runner.stop(runner);
    render.canvas.remove();
    render.textures = {};
  })

</script>

<template>
  <div class="draw-mode unselectable flex center hcenter" :style="`width: 100vw; height: 100vh; background: ${state.theme.value.BACKGROUND}`">
    <div ref="container">
      <LevelPage :state="state" @input="startLevel" @replay="startReplay" v-show="level === null" />
      <div
        class="flex hcenter absolute full-width"
        :style="`top: 5rem; z-index: 2; pointer-events: none; color: ${state.theme.value.TEXT}`"
        v-show="level !== null"
      >
        <div
          v-show="!showEndScreen"
          v-html="level?.text"
          class="px-2 py-1"
          :style="`text-align: center; pointer-events: none; background: ${state.theme.value.BACKGROUND}; max-width: 80vw; font-family: monospace`" />
        <div
          class="px-2"
          v-show="showEndScreen"
          :style="`pointer-events: none; background: ${state.theme.value.BACKGROUND}`"
        >
          <p style="font-size: 20vh;">Great job.</p>
            <div class="mx-4 mb-4">
              <div v-show="!isReplay">
                <div class="button br-0 pl-2" @click="returnToLevelSelect" style="width: fit-content; font-size: 1.25rem; pointer-events: all; display: inline-block">
                  <Icon name="chevron-left" class="mr-1" style="height: 1.25rem; top: 0.15rem" />Back <span class="ml-2" style="font-family: monospace; font-size: 1rem">[Esc]</span>
                </div>
                <!-- <div class="button br-0 pl-2" @click="nextLevel" style="width: fit-content; font-size: 1.25rem; pointer-events: all; display: inline-block">
                  <Icon name="chevron-right" class="mr-2" style="width: 1.75rem" />Next <span class="ml-2" style="font-family: monospace; font-size: 1rem; top:0.1rem">[Esc]</span>
                </div> -->
                <div class="button br-0 ml-4 flex center" style="width: fit-content; font-size: 1.25rem; pointer-events: all; display: inline-block" @click="level!.saveReplay">
                  <Icon name="download" style="height: 1.25rem; top: 0.2rem" class="mr-3" />Save replay
                </div>
              </div>
              <div class="button br-0 pl-2" @click="endReplay" style="width: fit-content; font-size: 1.25rem; pointer-events: all;" v-show="isReplay">
                <Icon name="chevron-left" class="mr-2" style="height: 1.25rem" />Back <span class="ml-2" style="font-family: monospace; font-size: 1rem; top:0.1rem">[Esc]</span>
              </div>
            </div>
        </div>
      </div>
      <div id="render" v-show="level !== null"></div>
    </div>
  </div>
</template>

<style scoped lang="postcss">

.draw-mode {
  overflow-y: hidden;
}

@media screen and (-webkit-min-device-pixel-ratio:0) { 
  select,
  textarea,
  input {
    font-size: 16px;
  }
}

#draw-mode {
  font-size: 16px;
  & button {
    font-size: 16px;
  }
}
</style>
