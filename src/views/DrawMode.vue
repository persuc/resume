<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  import decomp from 'poly-decomp'
  import Matter, { Common, Vector, type Vertex } from 'matter-js'
  import paper from 'paper'

  const STATE_KEY = 'drawModeState'
  const DEBOUNCE_LIMIT = 100

  const completed: number[] = reactive([])
  const isDrawing = ref(false)
  let timeOfLastPoint = 0

  Common.setDecomp(decomp)

  const scope = new paper.PaperScope()

  // module aliases
  const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

  // create an engine
  const engine = Engine.create();

  let render: Matter.Render

  let mousePath: paper.Path

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
      // console.log(e)
    }
      
  }

  function stopDrawing(e: MouseEvent) {
    isDrawing.value = false
  }

  function startDrawing(e: MouseEvent) {
    // isDrawing.value = true
    let isDrawing = false
    scope.activate()
    const tool = new paper.Tool();
    tool.onMouseDown = (event: paper.ToolEvent) => {
      isDrawing = true;
      mousePath = new paper.Path({
      strokeColor: '#E4141B',
      strokeWidth: 20,
      strokeCap: 'round'
    });
    }
    tool.onMouseDrag = (event: paper.ToolEvent) => {
      // event.delta.angle += 90;
      // event.delta.length = 4;

      // mousePath.add(new paper.Point(event.middlePoint.x + event.delta.x / 2, event.middlePoint.y + event.delta.y / 2));
      // mousePath.insert(0, new paper.Point(event.middlePoint.x - event.delta.x / 2, event.middlePoint.y - event.delta.y / 2));
      if (isDrawing) {
        mousePath.add(event.point)
        let step = event.delta.divide(2);
        step.angle += 90;
        step.length = 4;

        let top = event.middlePoint.add(step);
        let bottom = event.middlePoint.subtract(step);

        mousePath.add(top);
        mousePath.insert(0, bottom);
      }
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
      mousePath.add(event.point);
      mousePath.closed = true;
      isDrawing = false

      const vertices: Vector[] = mousePath.segments.map(s => s.point)

      const object = Bodies.fromVertices(Matter.Vertices.centre(vertices).x, Matter.Vertices.centre(vertices).y, [vertices], {
          isStatic: true,
          render: {
              fillStyle: 'red',
              strokeStyle: 'red'
          }
      }, true);
      Matter.World.add(engine.world, object);

      function boundsCenter(minX: number, minY: number, maxX: number, maxY: number){
        return new paper.Point((maxX + minX)/2, (maxY + minY)/2);
      }
      const difference = mousePath.position.subtract(boundsCenter(object.bounds.min.x, object.bounds.min.y, object.bounds.max.x, object.bounds.max.y));
      // align matterjs object with paperjs drawn shape
      Matter.Body.translate(object, difference);
    }

    // line = new Line(engine.world, [render.mouse.position])
    
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
        },
    });

    scope.setup(render.canvas)

    mousePath = new paper.Path({
      strokeColor: '#E4141B',
      strokeWidth: 20,
      strokeCap: 'round'
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
