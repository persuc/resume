<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref, type Ref } from 'vue'
  import decomp from 'poly-decomp'
  import Matter, { Bodies, Body, Common, Composite, Engine, Events, Mouse, Render, Runner, Vertices } from 'matter-js'
  import { startLevel, type Level, specifications } from '@/ts/draw-mode/Level'
  import * as Theme from '@/ts/draw-mode/Theme'
  import { themes } from '@/ts/draw-mode/Theme'

  const STATE_KEY = 'drawModeState'
  const CLEANUP_INTERVAL = 5000
  const ASPECT_RATIO = 800 / 600

  const completed: Set<number> = reactive(new Set([0]))
  const showEndScreen = ref(false)
  let timeOfLastCleanup = 0

  Common.setDecomp(decomp)

  const engine = Engine.create()
  let render: Matter.Render // created on load
  const runner = Runner.create()

  const container: Ref<HTMLElement> = ref() as Ref<HTMLElement>

  let level: Ref<Level | null> = ref(null)
  let themeIdx = 0
  let mouse: Mouse

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault()
    } else if (e.key === 'r') {
      if (level.value && !showEndScreen.value) {
        level.value.restart()
      }
    } else if (e.key === 't') {
      applyTheme((themeIdx + 1 ) % themes.length)
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
  function applyTheme(index: number) {
    if (index < 0 || index >= themes.length) {
      return
    }
    themeIdx = index
    const newTheme = themes[index]
    render.canvas.style.background = newTheme.background
    container.value.style.background = newTheme.background
    container.value.style.color = newTheme.text
    if (arrowBodies) {
      for (const part of arrowBodies.left.parts.concat(arrowBodies.right.parts)) {
        part.render.fillStyle = newTheme.text
      }
    }
    saveState()
    if (level.value !== null) {
      level.value.applyTheme(newTheme)
    }
  }

  const LEVELS_PER_PAGE = 6
  const LEVELS_PER_ROW = 3
  const THUMBNAIL_WIDTH = 200
  const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH / ASPECT_RATIO
  const THUMBNAIL_HORIZONTAL_PAD = 30
  const THUMBNAIL_VERTICAL_PAD = 50
  const THUMBNAIL_POSITION = new Array(LEVELS_PER_PAGE).fill(null).map((_, i) => ({
    x: (800 - (LEVELS_PER_ROW * THUMBNAIL_WIDTH - (LEVELS_PER_ROW - 1) * THUMBNAIL_HORIZONTAL_PAD)) / 2 + THUMBNAIL_WIDTH / 4 + i % LEVELS_PER_ROW * (THUMBNAIL_WIDTH + THUMBNAIL_HORIZONTAL_PAD),
    y: (600 - (LEVELS_PER_PAGE / LEVELS_PER_ROW * THUMBNAIL_HEIGHT - (LEVELS_PER_PAGE / LEVELS_PER_ROW - 1) * THUMBNAIL_VERTICAL_PAD)) * 3 / 5 + Math.floor(i / LEVELS_PER_ROW) * (THUMBNAIL_HEIGHT + THUMBNAIL_VERTICAL_PAD)
  }))
  const thumbnailBodies: Body[] = []
  let arrowBodies: {
    left: Body,
    right: Body,
  } | null = null
  let page = 0
  const images: (HTMLImageElement | null)[] = new Array(specifications.length).fill(null)
  function fetchImages() {
    Events.off(engine, 'afterUpdate', drawImages)
    if (arrowBodies) {
      arrowBodies.left.render.visible = page > 0
      arrowBodies.right.render.visible = LEVELS_PER_PAGE * (page + 1) < specifications.length
    }
    let loaded = 0
    const numberToLoad = Math.min(LEVELS_PER_PAGE, images.length - page * LEVELS_PER_PAGE)
    for (let i = page * LEVELS_PER_PAGE; i < Math.min(images.length, (page + 1) * LEVELS_PER_PAGE); i++) {
      if (images[i] !== null) {
        loaded++
      } else {
        const img = new Image()
        img.onload = () => {
          images[i] = img
          loaded++
          if (loaded === numberToLoad) {
            Events.on(engine, 'afterUpdate', drawImages)
            drawImages()
          }
        }
        img.src = `/draw-mode/Level_${String(i + 1).padStart(3, '0')}.png`
      }
    }
    if (loaded === numberToLoad) {
      Events.on(engine, 'afterUpdate', drawImages)
      drawImages()
    }
  }
  function drawImages() {
    const realHeight = (THUMBNAIL_HEIGHT / 600) * render.canvas.height
    const realWidth = (THUMBNAIL_WIDTH / 800) * render.canvas.width
    render.context.font = "20px serif"
    render.context.fillStyle = themes[themeIdx].text
    for (let i = page * LEVELS_PER_PAGE; i < Math.min((page + 1) * LEVELS_PER_PAGE, images.length); i++) {
      const image = images[i]
      if (image === null) {
        continue
      }
      if (!completed.has(i)) {
        render.context.globalAlpha = 0.1
      }
      const position = THUMBNAIL_POSITION[i % LEVELS_PER_PAGE]
      render.context.drawImage(
        image,
        position.x / 800 * render.canvas.width - realWidth / 2,
        position.y / 600 * render.canvas.height - realHeight / 2,
        realWidth,
        realHeight,
      )
      render.context.globalAlpha = 1
      render.context.fillText(
        `${String(i + 1).padStart(3, '0')}`,
        position.x / 800 * render.canvas.width - realWidth / 2,
        position.y / 600 * render.canvas.height - realHeight / 2 - 12,
      )
    }
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

    showLevelSelect()

    Render.run(render)
    Runner.run(runner, engine)
    Events.on(engine, 'afterUpdate', cleanup)

    applyTheme(themeIdx)
  })

  function showLevelSelect() {
    const ARROW_HEIGHT = 20
    const ARROW_WIDTH = 10

    const left = Bodies.fromVertices(30, 300, [[
      { x: -ARROW_WIDTH, y: 0 },
      { x: 0, y: -ARROW_HEIGHT },
      { x: ARROW_WIDTH, y: -ARROW_HEIGHT },
      { x: 0, y: 0 },
      { x: ARROW_WIDTH, y: ARROW_HEIGHT },
      { x: 0, y: ARROW_HEIGHT },
    ]], {
      isStatic: true,
      render: {
        visible: true,
        fillStyle: themes[themeIdx].text,
        strokeStyle: 'none'
      }
    })
    Composite.add(engine.world, left)
    
    const verts = [
      { x: ARROW_WIDTH, y: 0 },
      { x: 0, y: -ARROW_HEIGHT },
      { x: -ARROW_WIDTH, y: -ARROW_HEIGHT },
      { x: 0, y: 0 },
      { x: -ARROW_WIDTH, y: ARROW_HEIGHT },
      { x: 0, y: ARROW_HEIGHT },
    ]
    const right = Bodies.fromVertices(770, 300, [verts], {
      isStatic: true,
      render: {
        visible: true,
        fillStyle: themes[themeIdx].text,
        strokeStyle: 'none'
      }
    }, false, 0, 0, 0)
    Composite.add(engine.world, right)

    arrowBodies = {
      left,
      right
    }

    for (let i = 0; i < LEVELS_PER_PAGE; i++) {
      const body = Bodies.rectangle(
        THUMBNAIL_POSITION[i % LEVELS_PER_PAGE].x,
        THUMBNAIL_POSITION[i % LEVELS_PER_PAGE].y,
        THUMBNAIL_WIDTH,
        THUMBNAIL_HEIGHT,
        {
          isStatic: true,
          render: {
            visible: false,
            fillStyle: '#CCDCDC',
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
      fetchImages()
    }

    const mouseConstraint = Matter.MouseConstraint.create(
      engine,
      {
        mouse,
      }
    )
    mouseConstraint.constraint.render.type = 'pin'
    mouseConstraint.constraint.render.anchors = false
    mouseConstraint.constraint.render
    mouse = mouseConstraint.mouse
    render.mouse = mouse
    Composite.add(engine.world, mouseConstraint)

    function onMouseDown() {
      if (render.mouse.position.x < 50) {
        if (page > 0) {
          page -= 1
          fetchImages()
        }
        return
      }

      if (render.mouse.position.x > 750) {
        if ((page + 1) * LEVELS_PER_PAGE < specifications.length) {
          page += 1
          fetchImages()
        }
        return
      }

      const index = thumbnailBodies.findIndex(b => mouseConstraint.body === b)
      if (index === -1 || index >= specifications.length - page * LEVELS_PER_PAGE) {
        return
      }

      if (!completed.has(index + page * LEVELS_PER_PAGE)) {
        return
      }

      const levelIndex = page * LEVELS_PER_PAGE + index
      clickLevel(levelIndex)
      Events.off(mouseConstraint, 'mousedown', onMouseDown)
      Events.off(engine, 'afterUpdate', drawImages)
      Composite.remove(engine.world, thumbnailBodies)
      thumbnailBodies.splice(0)
      if (arrowBodies) {
        Composite.remove(engine.world, [arrowBodies.left, arrowBodies.right])
        arrowBodies = null
      }
      Composite.remove(engine.world, mouseConstraint)
      mouse = Matter.Mouse.create(render.canvas)
      render.mouse = mouse
    }
    Events.on(mouseConstraint, 'mousedown', onMouseDown)
  }

  function clickLevel(index: number) {
    level.value = startLevel(engine, specifications[index], themes[themeIdx], () => {
      showEndScreen.value = true
      if (level.value?.line) {
        level.value.endLine()
      }
      completed.add(index + 1)
      saveState()
      setTimeout(returnToLevelSelect, 3000)
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
    level.value = null
    showLevelSelect()
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
    completed: [0],
    theme: 0
  }
  type StateType = typeof defaultState;

  function loadSerialized(serialized: string) {
    const loadedState: StateType = JSON.parse(serialized)
    completed.clear()
    completed.add(0)
    for (const v of loadedState.completed) {
      completed.add(v)
    }
    if (loadedState.theme < themes.length && loadedState.theme >= 0) {
      themeIdx = loadedState.theme
    }
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
      completed: Array.from(completed),
      theme: themeIdx
    }
    localStorage.setItem(STATE_KEY, JSON.stringify(savedState))
  }

</script>

<template>
  <div class="draw-mode" ref="container" style="width: 100vw; height: 100vh; margin: 0 auto">
    <div class="flex hcenter absolute full-width" style="top: 5rem; z-index: 2; pointer-events: none;">
      <pre v-show="!showEndScreen" v-html="level?.text" style="text-align: center; pointer-events: none;"></pre>
      <span v-show="showEndScreen" style="font-size: 20vh; pointer-events: none;">Great job.</span>
    </div>
    <div id="render"></div>
    <!-- <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a> -->
  </div>
</template>

<style scoped lang="postcss">

.draw-mode {
  /* background-color: rgb(20, 21, 31); */
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
