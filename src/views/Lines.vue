<script setup lang="ts">
import Header from '@/components/Header.vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const canvas: Ref<HTMLCanvasElement> = ref(null) as unknown as Ref<HTMLCanvasElement>
const LINES = 10;
let gl: WebGL2RenderingContext;
let program: WebGLProgram;
let buffer: WebGLBuffer;

function getRandomColor() {
  return [Math.random(), Math.random(), Math.random()];
}

function draw(time: DOMHighResTimeStamp) {

  // TODO: render
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.0, 0.0, 0.5, 0.0]),
    gl.DYNAMIC_DRAW,
  );
  gl.drawArrays(gl.LINE_STRIP, 0, 2);

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

    void main() {
      gl_Position = vec4(position.x, position.y, 0.0, 1.0);
    }
  `);
  gl.compileShader(vertexShader);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, `
    #version 100
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.18, 0.54, 0.34, 1.0);
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

  gl.enableVertexAttribArray(0); // x position of each vert
  // gl.enableVertexAttribArray(1); // y position of each vert
  buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  // canvas.width = canvas.clientWidth;
  // canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  
  window.requestAnimationFrame(draw)
})

function cleanUp() {
  gl.useProgram(null);
  if (buffer) {
    gl.deleteBuffer(buffer);
  }
  if (program) {
    gl.deleteProgram(program);
  }
}

onUnmounted(() => {
  cleanUp();
})

</script>

<template>

  <Header />

  <div class="lines px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h2>Shader playground</h2>

    <canvas ref="canvas" width="800" height="600"></canvas>

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
