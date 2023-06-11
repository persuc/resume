<script setup lang="ts">
import LevelPage from '@/components/draw-mode/LevelPage.vue'
import { ASPECT_RATIO, CLEANUP_INTERVAL } from '@/ts/draw-mode/Config'
import { cleanupEndConditions } from '@/ts/draw-mode/EndCondition'
import { createLevel, type LevelSpec } from '@/ts/draw-mode/Level'
import { ReplayPlayer, type Replay } from '@/ts/draw-mode/Replay'
import { createState } from '@/ts/draw-mode/State'
import { themes, type Theme } from '@/ts/draw-mode/Theme'
import type { DrawModeNavigation } from '@/ts/draw-mode/World'
import Matter, { Common, Composite, Engine, Events, Mouse, Render, Runner } from 'matter-js'
import decomp from 'poly-decomp'
import { onMounted, onUnmounted, reactive, ref, type Ref } from 'vue'
  
  const state = createState()
  let timeOfLastCleanup = 0
  const replayPlayer = ReplayPlayer

  Common.setDecomp(decomp)

  const engine = Engine.create()
  let render: Matter.Render // created on load
  const runner = Runner.create()
  const container: Ref<HTMLElement> = ref() as Ref<HTMLElement>

  const navigation: DrawModeNavigation = reactive({
    worldPage: 0,
    levelPage: 0,
    worldIdx: 0,
    levelIdx: 0,
    world: null,
    level: null,
    showEndScreen: false,
    isReplay: false
  })
  let mouse: Mouse

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'r') {
      if (navigation.level && !navigation.showEndScreen) {
        if (navigation.isReplay) {
          replayPlayer.stop()
          const replay = replayPlayer.getReplay()
          resetEngine()
          if (replay) {
            startReplay(replay)
          }
        } else {
          navigation.level.restart()
        }
      }
    } else if (e.key === 't') {
      const themesValues = Object.values(themes)
      const themeIdx = themesValues.findIndex(theme => state.theme.value === theme)
      applyTheme(themesValues[(themeIdx + 1) % themesValues.length])
    } else if (e.key === 'Escape') {
      if (navigation.level) {
        endLevel()
      }
    }
  }
  function startDrawing(e: MouseEvent) {
    if (e.target !== render.canvas || navigation.showEndScreen || navigation.isReplay) {
      return
    }
    if (navigation.level) {
      navigation.level.startLine().addPoint(render.mouse.position)
    }
  }
  function draw(e: MouseEvent) {
    if (e.target === render.canvas && navigation.level && !navigation.isReplay) {
      navigation.level.drawLine(render.mouse.position)
    }
  }
  function stopDrawing() {
    if (navigation.level && !navigation.isReplay) {
      navigation.level.endLine()
    }
  }
  function applyTheme(theme: Theme) {
    state.theme.value = theme
    render.canvas.style.background = theme.BACKGROUND
    if (navigation.level !== null) {
      navigation.level.applyTheme(theme)
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
    navigation.level = createLevel(engine, spec, state.theme.value, () => {
      navigation.showEndScreen = true
      if (navigation.level?.line) {
        navigation.level.endLine()
      }
      state.completed.add(spec.id)
      state.save()
    })
  }

  function returnToLevelSelect() {
    if (!navigation.level) {
      return
    }

    if (navigation.level.line) {
      navigation.level.endLine()
    }

    resetEngine()
  }

  function resetEngine() {
    navigation.showEndScreen = false
    Composite.clear(engine.world, false)
    cleanupEndConditions(engine)
    navigation.level = null
  }

  function cleanup() {
    const time = Date.now()
    if (time - timeOfLastCleanup >= CLEANUP_INTERVAL) {
      timeOfLastCleanup = time
      if (!navigation.level) {
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
    navigation.isReplay = true
  
    navigation.level = createLevel(engine, replay.spec, state.theme.value, () => {
      navigation.showEndScreen = true
    })

    replayPlayer.start(replay, navigation.level)
    
    Events.on(engine, 'afterUpdate', replayPlayer.render)
  }

  function endLevel() {
    if (navigation.isReplay) {
      navigation.isReplay = false
      Events.off(engine, 'afterUpdate', replayPlayer.render)
    }
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
      <LevelPage :state="state" @input="startLevel" @replay="startReplay" :navigation="navigation" @end="endLevel" />
      <div id="render" v-show="navigation.level !== null"></div>
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
