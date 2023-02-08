<script setup lang="ts">
// https://mattdesl.svbtle.com/drawing-lines-is-hard
// https://blog.scottlogic.com/2019/11/18/drawing-lines-with-webgl.html
// https://wwwtyro.net/2019/11/18/instanced-lines.html
import Header from '@/components/Header.vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const canvas: Ref<HTMLCanvasElement> = ref(null) as unknown as Ref<HTMLCanvasElement>
let gl: WebGL2RenderingContext;
let program: WebGLProgram;
let positionBuffer: WebGLBuffer;
let paused = ref(true);
const speed = 0.0001;
let delta = 0;
let lastFrame: DOMHighResTimeStamp = 0;
const LINES = 10;
const lines: number[][] = [
  [-0.01, 0.0],
]

const minLineHeight = -0.02 * Math.floor(LINES / 2);

for (let i = 1; i < LINES; i++) {
  lines.push([-0.01, minLineHeight + 0.02 * i])
}
const colors: number[][] = []

for (let i = 0; i < LINES; i++) {
  const randomLight = () => 0.1 + Math.random() * 0.3;
  const randomDark = () => 0.6 + Math.random() * 0.3;
  colors.push(i % 2 === 1
    ? [randomLight(), randomLight(), randomLight()]
    : [randomDark(), randomDark(), randomDark()]
  )
}

let direction: boolean = false;
let flipTime: DOMHighResTimeStamp = 0;

function draw(time: DOMHighResTimeStamp) {

  delta = (time - lastFrame);
  lastFrame = time;

  let lastX = lines[0][lines[0].length - 2];
  let lastY = lines[0][lines[0].length - 1];
  
  while (lastX < -0.01) {
    if (time > flipTime || Math.abs(lastY) >= 0.3) {
      flipTime = 200 + (Math.random() * 800) + time;
      if (lastY >= 0.3) {
        direction = false;
      } else if (lastY <= 0.3) {
        direction = true;
      } else {
        direction = !direction;
      }
    }
    for (const line of lines) {
      line.push(lastX + 0.01, line[line.length - 1] + (direction ? 0.02 : -0.02))
    }
    lastX += 0.02;
  }

  let firstX = lines[0][0];
  
  while (firstX < -1.0) {
    for (const line of lines) {
      line.shift()
      line.shift()
    }
    firstX = lines[0][0];
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let color = colors[i];
    for (let i = 0; i < line.length / 2; i++) {
      line[i * 2] -= delta * speed;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(line),
      gl.DYNAMIC_DRAW,
    );
    gl.uniform3f(gl.getUniformLocation(program, 'uColor'), color[0], color[1], color[2]);

    gl.drawArrays(gl.POINTS, 0, line.length / 2);
  }

  if (!paused.value)
    window.requestAnimationFrame(draw);
}

onMounted(() => {
  gl = canvas.value.getContext('webgl2')!;
  if (gl === null) {
    console.error('GL context could not be obtained');
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vertexShader, `
    #version 100
    precision highp float;

    attribute vec2 position;
    uniform vec3 uColor;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = vec4(position.x, position.y, 0.0, 1.0);
      gl_PointSize = 6.0;
      vColor = vec4(uColor.r, uColor.g, uColor.b, 1.0);
    }
  `);
  gl.compileShader(vertexShader);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, `
    #version 100
    precision mediump float;

    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vec4(vColor.r, vColor.g, vColor.b, 1.0);
    }
  `);
  gl.compileShader(fragmentShader);
  program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkErrLog = gl.getProgramInfoLog(program);
    cleanUp();
    console.error(`Shader program did not link successfully. Error log: ${linkErrLog}`);
    return;
  }

  gl.enableVertexAttribArray(0); // positions of each vert in each line
  positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  // canvas.width = canvas.clientWidth;
  // canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
})

function cleanUp() {
  gl.useProgram(null);
  if (positionBuffer) {
    gl.deleteBuffer(positionBuffer);
  }
  if (program) {
    gl.deleteProgram(program);
  }
}

onUnmounted(() => {
  cleanUp();
})

function togglePaused() {
  paused.value = !paused.value
  if (!paused.value) {
    window.requestAnimationFrame(draw);
  }
}

</script>

<template>

  <Header />

  <div class="lines px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h2>Shader playground <div class="button" style="display: inline-block; font-size: 1rem;" @click="togglePaused">{{ paused ? 'Play' : 'Pause' }}</div></h2>

    <canvas ref="canvas" width="800" height="600" style="background-color: white;"></canvas>

  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2rem;
}

h3 {
  font-size: 1.2rem;
}

</style>
