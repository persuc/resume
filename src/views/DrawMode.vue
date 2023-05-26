<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  import decomp from 'poly-decomp'
  import Matter, { Body, Bounds, Common, Vertices } from 'matter-js'
  import Line, { distance } from '@/matter-lines/main'

  const STATE_KEY = 'drawModeState'
  const DEBOUNCE_DISTANCE_LIMIT = 10
  const ASPECT_RATIO = 800 / 600

  const completed: number[] = reactive([])
  const isDrawing = ref(false)

  Common.setDecomp(decomp)

  // module aliases
  const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

  // create an engine
  const engine = Engine.create()

  let render: Matter.Render

  let line: Line

  const bodies = [
    // Two boxes
    // Bodies.rectangle(400, 200, 80, 80, {
    //   render: {
    //     fillStyle: "#BBBBBB"
    //   }
    // }),
    // Bodies.rectangle(450, 50, 80, 80, {
    //   render: {
    //     fillStyle: "#BBBBBB"
    //   }
    // }),
    Body.create({
      isStatic: true,
      parts: [
        Bodies.rectangle(400, 610, 800, 60, {
          render: {
            fillStyle: "#FDFDFD"
          }
        }),
        Bodies.rectangle(10, 300, 20, 600, {
          render: {
            fillStyle: "#FDFDFD"
          }
        }),
        Bodies.rectangle(790, 300, 20, 600, {
          render: {
            fillStyle: "#FDFDFD"
          }
        }),
      ]
    })
  ]

  // add all of the bodies to the world
  Composite.add(engine.world, bodies);

  // create runner
  const runner = Runner.create();

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault()
    } 
  }
  function startDrawing(e: MouseEvent) {
    isDrawing.value = true
    line = new Line(engine)
    line.addPoint(render.mouse.position)
  }
  function draw(e: MouseEvent) {
    if (
      isDrawing.value &&
      e.target === render.canvas &&
      (
        line.points.length === 0 ||
        (line.points.length > 0 && distance(line.points[line.points.length - 1], render.mouse.position) > DEBOUNCE_DISTANCE_LIMIT)
      )
    ) {
      line.addPoint(render.mouse.position)
    }
      
  }
  function stopDrawing(e: MouseEvent) {
    isDrawing.value = false
    Body.setStatic(line.body, false)
  }

  function onResize() {
    const canvases = document.getElementsByTagName('canvas')
    if (!canvases.length) {
      return
    }
    const canvas: HTMLCanvasElement = canvases[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    const aspect = window.innerWidth / window.innerHeight
    if (aspect > ASPECT_RATIO) {
      render.options.height = window.innerHeight
      render.options.width = window.innerHeight * ASPECT_RATIO
    } else {
      render.options.width = window.innerWidth
      render.options.height = window.innerWidth / ASPECT_RATIO
    }
  }

  onMounted(() => {
    document.addEventListener("keyup", onKeyUp )
    document.addEventListener("mousemove", draw )
    document.addEventListener("mouseup", stopDrawing )
    document.addEventListener("mousedown", startDrawing )
    window.addEventListener("resize", onResize)
    loadState()
    // create a renderer
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

    // add a mouse
    const mouse = Matter.Mouse.create(render.canvas)
    render.mouse = mouse

    // run the renderer
    Render.run(render)

    // run the engine
    Runner.run(runner, engine)
  })

  onUnmounted(() => {
    document.removeEventListener( "keyup", onKeyUp )
    document.removeEventListener( "mousemove", draw )
    document.removeEventListener( "mouseup", stopDrawing )
    document.removeEventListener( "mousedown", startDrawing )
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

<!-- rgb(20, 21, 31) 0% 0% -->
<template>
  <div class="draw-mode" style="width: 100vw; height: 100vh; margin: 0 auto">
    <div id="render"></div>
    <!-- <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a> -->
  </div>
</template>

<style scoped lang="postcss">

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
