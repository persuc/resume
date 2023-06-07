<script setup lang="ts">
  import { onMounted, onUnmounted, ref, type Ref } from 'vue'
  import decomp from 'poly-decomp'
  import LevelPage from '@/components/draw-mode/LevelPage.vue'
  import Matter, { Common, Composite, Engine, Events, Mouse, Render, Runner } from 'matter-js'
  import { createLevel, type Level, type LevelSpec } from '@/ts/draw-mode/Level'
  import { themes, type Theme } from '@/ts/draw-mode/Theme'
  import { createState } from '@/ts/draw-mode/State'
  import { ASPECT_RATIO, CLEANUP_INTERVAL } from '@/ts/draw-mode/Config'
  import { cleanupEndConditions } from '@/ts/draw-mode/EndCondition'
  
  const showEndScreen = ref(false)
  const state = createState()
  let timeOfLastCleanup = 0
  let returnToLevelSelectTimeouts: number[] = []

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
        level.value.restart()
      }
    } else if (e.key === 't') {
      const themesValues = Object.values(themes)
      const themeIdx = themesValues.findIndex(theme => state.theme.value === theme)
      applyTheme(themesValues[(themeIdx + 1) % themesValues.length])
    } else if (e.key === 'Escape') {
      returnToLevelSelect()
    }
  }
  function startDrawing(e: MouseEvent) {
    if (e.target !== render.canvas || showEndScreen.value) {
      return
    }
    if (level.value) {
      level.value.startLine(render.mouse.position)
    }
  }
  function draw(e: MouseEvent) {
    if (e.target === render.canvas && level.value) {
      level.value.drawLine(render.mouse.position)
    }
  }
  function stopDrawing() {
    if (level.value) {
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
      returnToLevelSelectTimeouts.push(setTimeout(returnToLevelSelect, 3000))
    })
  }

  function returnToLevelSelect() {
    if (!level.value) {
      return
    }

    if (level.value.line) {
      level.value.endLine()
    }
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
      <LevelPage :state="state" @input="startLevel" v-show="level === null" />
      <div
        class="flex hcenter absolute full-width"
        :style="`top: 5rem; z-index: 2; pointer-events: none; color: ${state.theme.value.TEXT}`"
        v-show="level !== null"
      >
        <pre
          v-show="!showEndScreen"
          v-html="level?.text"
          :style="`text-align: center; pointer-events: none; background: ${state.theme.value.BACKGROUND}`" />
        <span
          v-show="showEndScreen"
          :style="`font-size: 20vh; pointer-events: none; background: ${state.theme.value.BACKGROUND}`"
        >
          Great job.
        </span>
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
