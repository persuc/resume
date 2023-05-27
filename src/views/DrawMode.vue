<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref, type Ref } from 'vue'
  import decomp from 'poly-decomp'
  import Matter, { Bodies, Body, Common, Composite, Engine, Events, Mouse, Render, Runner } from 'matter-js'
  import { startLevel, type Level, specifications } from '@/ts/draw-mode/Level'
  import * as Theme from '@/ts/draw-mode/Theme'
  import { themes } from '@/ts/draw-mode/Theme'

  const STATE_KEY = 'drawModeState'
  const CLEANUP_INTERVAL = 5000
  const ASPECT_RATIO = 800 / 600

  const completed: number[] = reactive([])
  const showEndScreen = ref(false)
  let timeOfLastCleanup = 0

  Common.setDecomp(decomp)

  const engine = Engine.create()
  let render: Matter.Render
  const runner = Runner.create();

  let level: Ref<Level | null> = ref(null)
  let levelIndex = -1
  let theme = Theme.DEFAULT
  let mouse: Mouse

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault()
    } else if (e.key === 'r') {
      if (level.value) {
        level.value.restart()
      }
    } else if (e.key === 't') {
      if (level.value) {
        level.value.applyTheme(themes[(themes.findIndex(t => t === level.value!.theme) + 1 ) % themes.length])
      }
    }
  }
  function startDrawing(e: MouseEvent) {
    if (e.target !== render.canvas && !showEndScreen.value) {
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

  const LEVELS_PER_PAGE = 6
  const LEVELS_PER_ROW = 3
  const THUMBNAIL_WIDTH = 220
  const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH / ASPECT_RATIO
  const THUMBNAIL_HORIZONTAL_PAD = 30
  const THUMBNAIL_VERTICAL_PAD = 30
  const THUMBNAIL_POSITION = new Array(LEVELS_PER_PAGE).fill(null).map((_, i) => ({
    x: (800 - (LEVELS_PER_ROW * THUMBNAIL_WIDTH - (LEVELS_PER_ROW - 1) * THUMBNAIL_HORIZONTAL_PAD)) * 3 / 4 + i % LEVELS_PER_ROW * (THUMBNAIL_WIDTH + THUMBNAIL_HORIZONTAL_PAD),
    y: (600 - (LEVELS_PER_PAGE / LEVELS_PER_ROW * THUMBNAIL_HEIGHT - (LEVELS_PER_PAGE / LEVELS_PER_ROW - 1) * THUMBNAIL_VERTICAL_PAD)) * 3 / 5 + Math.floor(i / LEVELS_PER_ROW) * (THUMBNAIL_HEIGHT + THUMBNAIL_VERTICAL_PAD)
  }))
  const thumbnailBodies: Body[] = []
  const page = 0
  const images: HTMLImageElement[] = []
  function drawImages() {
    const realHeight = (THUMBNAIL_HEIGHT / 600) * render.canvas.height
    const realWidth = (THUMBNAIL_WIDTH / 800) * render.canvas.width
    images.forEach((image, i) => {
      render.context.drawImage(
        image,
        THUMBNAIL_POSITION[i].x / 800 * render.canvas.width - realWidth / 2,
        THUMBNAIL_POSITION[i].y / 600 * render.canvas.height - realHeight / 2,
        realWidth,
        realHeight,
      )
    })
  }

  function onResize() {
    const canvas: HTMLCanvasElement = render.canvas
    const div: HTMLElement = render.canvas.parentElement!
    const aspect = window.innerWidth / window.innerHeight
    if (aspect > ASPECT_RATIO) {
      render.options.width = window.innerHeight * ASPECT_RATIO
      render.options.height = window.innerHeight
      const padding = Math.round((window.innerWidth - render.options.width) / 2)
      div.style.paddingLeft = `${padding}px`
      div.style.paddingTop = '0px'
    } else {
      render.options.width = window.innerWidth
      render.options.height = window.innerWidth / ASPECT_RATIO
      const padding = Math.round((window.innerHeight - render.options.height) / 2)
      div.style.paddingLeft = '0px'
      div.style.paddingTop = `${padding}px`
    }
    canvas.width = render.options.width
    canvas.height = render.options.height
    drawImages()
  }

  onMounted(() => {
    document.addEventListener("keyup", onKeyUp )
    document.addEventListener("mousemove", draw )
    document.addEventListener("mouseup", stopDrawing )
    document.addEventListener("mousedown", startDrawing )
    window.addEventListener("resize", onResize)
    loadState()
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

    // const img = new Image()
    // img.onload = () => {
      // render.textures['testImage'] = img
      // const test = Bodies.rectangle(
      // 50, 500, 100, 100, {
      //     isStatic: true,
      //     render: {
      //       fillStyle: '#00DADA',
      //       // strokeStyle: '#ffffff',
      //       // https://github.com/liabru/matter-js/blob/ce03208c5f597d4a5bceaf133cc959c428dd5147/src/render/Render.js#L772
      //       // sprite: {
      //       //   texture: 'testImage',
      //       //   xScale: 1,
      //       //   yScale: 1,
      //       // }
      //     }
      //   }
      // )
      // Composite.add(engine.world, test)

    //   Events.on(engine, 'afterUpdate', () => {
    //     render.context.drawImage(
    //       img,
    //       THUMBNAIL_POSITION[0].x - (THUMBNAIL_WIDTH - 28) / 2,
    //       THUMBNAIL_POSITION[0].y - (THUMBNAIL_HEIGHT - 20) / 2,
    //       THUMBNAIL_WIDTH - 10,
    //       THUMBNAIL_HEIGHT - 10 / ASPECT_RATIO,
    //     )
    //   })
    // }
    // img.onerror = () => {
    //   console.error('Could not load')
    // }
    // img.src = `/draw-mode/Level_001.png`

    showLevelSelect()

    Render.run(render)
    Runner.run(runner, engine)
    Events.on(engine, 'afterUpdate', cleanup)
  })

  function showLevelSelect() {
    images.splice(0)
    for (let i = LEVELS_PER_PAGE * page; i < (page + 1) * LEVELS_PER_PAGE && i < specifications.length; i++) {
      const body = Bodies.rectangle(
        THUMBNAIL_POSITION[i % LEVELS_PER_PAGE].x,
        THUMBNAIL_POSITION[i % LEVELS_PER_PAGE].y,
        THUMBNAIL_WIDTH,
        THUMBNAIL_HEIGHT,
        {
          isStatic: true,
          render: {
            fillStyle: '#CCDCDC',
            // strokeStyle: '#ffffff',
            // sprite: {
            //   texture: `/draw-mode/Level_${String(i + 1).padStart(3, '0')}.png`,
            //   xScale: 1,
            //   yScale: 1,
            // }
          }
        }
      )
      thumbnailBodies.push(body)
      Composite.add(engine.world, body)
      const img = new Image()
      img.onload = () => {
        images.push(img)
        if (images.length === Math.min(LEVELS_PER_PAGE, specifications.length - page * LEVELS_PER_PAGE)) {
          Events.on(engine, 'afterUpdate', drawImages)
          drawImages()
        }
      }
      img.src = `/draw-mode/Level_${String(i + 1).padStart(3, '0')}.png`
    }

    const mouseConstraint = Matter.MouseConstraint.create(
      engine, {
        mouse,
      }
    );
    Composite.add(engine.world, mouseConstraint)

    function callback() {
      const index = thumbnailBodies.findIndex(b => mouseConstraint.body === b)
      if (index === -1) {
        return
      }
      const levelIndex = page * LEVELS_PER_PAGE + index
      clickLevel(levelIndex)
      Events.off(mouseConstraint, 'mousedown', callback)
      Events.off(engine, 'afterUpdate', drawImages)
      Composite.remove(engine.world, thumbnailBodies)
      Composite.remove(engine.world, mouseConstraint)
    }
    Events.on(mouseConstraint, 'mousedown', callback)
  }

  function clickLevel(index: number) {
    level.value = startLevel(engine, specifications[index], theme, () => {
      showEndScreen.value = true
      if (level.value?.line) {
        level.value.endLine()
      }
      setTimeout(() => {
        showEndScreen.value = false
        Composite.clear(engine.world, false)
        level.value = null
        showLevelSelect()
      }, 3000)
    })
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
    document.removeEventListener( "keyup", onKeyUp )
    document.removeEventListener( "mousemove", draw )
    document.removeEventListener( "mouseup", stopDrawing )
    document.removeEventListener( "mousedown", startDrawing )
    Events.off(engine, 'afterTick', cleanup)
    Engine.clear(engine);
    Render.stop(render);
    Runner.stop(runner);
    render.canvas.remove();
    render.textures = {};
  })

  const defaultState = {
    completed: [] as number[]
  }
  type StateType = typeof defaultState;

  function loadSerialized(serialized: string) {
    const loadedState: StateType = JSON.parse(serialized)
    completed.splice(0)
    completed.push(...loadedState.completed)
  }

  function loadState() {
    const defaultSerialized = JSON.stringify(defaultState)
    const serializedState: string = localStorage.getItem(STATE_KEY) ?? defaultSerialized
    try {
      loadSerialized(serializedState)
    } catch (e) {
      console.error(
        'Error loading state from local storage:',
        e,
        'falling back to default state'
      )
      console.warn('Serialized state:', serializedState)
      localStorage.removeItem(STATE_KEY)
      loadSerialized(defaultSerialized)
    }
  }

  function saveState() {
    const savedState: StateType = {
      completed
    }
    localStorage.setItem(STATE_KEY, JSON.stringify(savedState))
  }

</script>

<template>
  <div class="draw-mode" style="width: 100vw; height: 100vh; margin: 0 auto">
    <div class="flex hcenter absolute full-width" style="top: 5rem; color: white; z-index: 2">
      <pre v-show="!showEndScreen" v-html="level?.text" style="text-align: center;"></pre>
      <span v-show="showEndScreen" style="font-size: 20vh">Great job.</span>
    </div>
    <div id="render"></div>
    <!-- <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a> -->
  </div>
</template>

<style scoped lang="postcss">

.draw-mode {
  background-color: rgb(20, 21, 31);
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
