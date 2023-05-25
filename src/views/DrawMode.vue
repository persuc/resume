<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  import decomp from 'poly-decomp'
  import Matter, { Common } from 'matter-js'
  import Line from '@/matter-lines/main'

  const STATE_KEY = 'drawModeState'
  const DEBOUNCE_LIMIT = 30

  const completed: number[] = reactive([])
  const isDrawing = ref(false)
  let timeOfLastPoint = 0

  Common.setDecomp(decomp)

  // module aliases
  const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

  // create an engine
  const engine = Engine.create();

  let render: Matter.Render

  let line: Line

  // create two boxes and a ground
  const boxA = Bodies.rectangle(400, 200, 80, 80);
  const boxB = Bodies.rectangle(450, 50, 80, 80);
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  // add all of the bodies to the world
  Composite.add(engine.world, [boxA, boxB, ground]);

  // create runner
  const runner = Runner.create();

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault()
    } 
  }

  function draw(e: MouseEvent) {
    const time = Date.now()
    if (isDrawing.value && e.target === render.canvas && time - timeOfLastPoint > DEBOUNCE_LIMIT) {
      // console.log(render.mouse.position)
      line.addPoint(render.mouse.position)
      timeOfLastPoint = time
    }
      
  }
  function stopDrawing(e: MouseEvent) {
    isDrawing.value = false
  }
  function startDrawing(e: MouseEvent) {
    isDrawing.value = true
    line = new Line(engine.world)
  }

  onMounted(() => {
    document.addEventListener( "keyup", onKeyUp )
    document.addEventListener( "mousemove", draw )
    document.addEventListener( "mouseup", stopDrawing )
    document.addEventListener( "mousedown", startDrawing )
    loadState()
    // create a renderer
    render = Render.create({
        element: document.getElementById('render')!,
        engine: engine,
        options: {
          // showMousePosition: true,
          wireframes: false
        },
    });

    // add a mouse
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, { mouse })
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouseConstraint.mouse;

    // run the renderer
    Render.run(render);

    // run the engine
    Runner.run(runner, engine);
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

<template>
  <div class="draw-mode px-8 pt-8" style="width: 60rem; margin: 0 auto;">
    <div id="render"></div>
    <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a>
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
