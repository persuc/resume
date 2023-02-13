<script setup lang="ts">
// https://mattdesl.svbtle.com/drawing-lines-is-hard
// https://blog.scottlogic.com/2019/11/18/drawing-lines-with-webgl.html
// https://wwwtyro.net/2019/11/18/instanced-lines.html
// Except instanced arrays were promoted to core and no longer available as an extension
// https://registry.khronos.org/webgl/extensions/ANGLE_instanced_arrays/

import Header from '@/components/Header.vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const canvas: Ref<HTMLCanvasElement> = ref(null) as unknown as Ref<HTMLCanvasElement>
let gl: WebGL2RenderingContext;
let segmentProgram: WebGLProgram;
let joinProgram: WebGLProgram;
let pointBuffer: WebGLBuffer;
let segmentBuffer: WebGLBuffer;
let circleBuffer: WebGLBuffer;
let paused = ref(true);
const speed = 0.0001;
let delta = 0;
let direction: boolean = false;
let flipTime: DOMHighResTimeStamp = 0;
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
  const randomDark = () => 0.55 + Math.random() * 0.3;
  colors.push(i % 2 === 1
    ? [randomLight(), randomLight(), randomLight()]
    : [randomDark(), randomDark(), randomDark()]
  )
}

const segmentInstance = [
  0, -0.5,
  1, -0.5,
  1,  0.5,
  0, -0.5,
  1,  0.5,
  0,  0.5,
];

const circleInstance = [0.0, 0.0];
const circleResolution = 8;
for (let wedge = 0; wedge <= circleResolution; wedge++) {
  const theta = (2 * Math.PI * wedge) / circleResolution;
  circleInstance.push(0.5 * Math.cos(theta), 0.5 * Math.sin(theta));
}

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
    const vertical = Math.random() * 0.01;
    for (const line of lines) {
      line.push(lastX + 0.01, line[line.length - 1] + (direction ? 1 : -1) * vertical)
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
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(line),
      gl.DYNAMIC_DRAW,
    );
    gl.useProgram(segmentProgram);
    gl.uniform3f(gl.getUniformLocation(segmentProgram, 'uColor'), color[0], color[1], color[2]);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, line.length / 2 - 1);

    if (line.length > 2) {
      gl.useProgram(joinProgram);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(line.slice(0, line.length - 2)),
        gl.DYNAMIC_DRAW,
      );
      gl.uniform3f(gl.getUniformLocation(joinProgram, 'uColor'), color[0], color[1], color[2]);
      gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, circleResolution + 2, (line.length / 2) - 2);
    }
  }

  if (!paused.value)
    window.requestAnimationFrame(draw);
}

onMounted(() => {
  gl = canvas.value.getContext('webgl2')!;
  if (gl === null) {
    console.error('GL context could not be obtained');
  }

  const segmentVertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(segmentVertexShader, `
    #version 100
    precision highp float;
    uniform float uWidth;

    attribute vec2 position, pointA, pointB;
    uniform vec3 uColor;

    varying lowp vec4 vColor;

    void main() {
      vec2 xBasis = pointB - pointA;
      vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
      vec2 point = pointA + xBasis * position.x + yBasis * uWidth * position.y;
      gl_Position = vec4(point, 0, 1);
      vColor = vec4(uColor.r, uColor.g, uColor.b, 1.0);
    }
  `);
  gl.compileShader(segmentVertexShader);
  const segmentFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(segmentFragmentShader, `
    #version 100
    precision mediump float;

    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vec4(vColor.r, vColor.g, vColor.b, 1.0);
    }
  `);
  gl.compileShader(segmentFragmentShader);

  segmentProgram = gl.createProgram()!;
  gl.attachShader(segmentProgram, segmentVertexShader);
  gl.attachShader(segmentProgram, segmentFragmentShader);
  gl.linkProgram(segmentProgram);
  gl.detachShader(segmentProgram, segmentVertexShader);
  gl.detachShader(segmentProgram, segmentFragmentShader);
  gl.deleteShader(segmentVertexShader);
  gl.deleteShader(segmentFragmentShader);
  if (!gl.getProgramParameter(segmentProgram, gl.LINK_STATUS)) {
    const linkErrLog = gl.getProgramInfoLog(segmentProgram);
    cleanUp();
    console.error(`Segment program did not link successfully. Error log: ${linkErrLog}`);
    return;
  }

  // geometry for line segments
  segmentBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, segmentBuffer);
  const segmentAttributeLocation = gl.getAttribLocation(segmentProgram, 'position');
  gl.enableVertexAttribArray(segmentAttributeLocation);
  gl.vertexAttribPointer(segmentAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(segmentAttributeLocation, 0);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(segmentInstance),
    gl.STATIC_DRAW,
  );

  pointBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);

  const pointALocation = gl.getAttribLocation(segmentProgram, 'pointA');
  gl.enableVertexAttribArray(pointALocation);
  gl.vertexAttribPointer(pointALocation, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(pointALocation, 1);

  const pointBLocation = gl.getAttribLocation(segmentProgram, 'pointB');
  gl.enableVertexAttribArray(pointBLocation);
  gl.vertexAttribPointer(pointBLocation, 2, gl.FLOAT, false, 0, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.vertexAttribDivisor(pointBLocation, 1);

  // line joins

  const joinVertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(joinVertexShader, `
    #version 100
    precision highp float;
    uniform float uWidth;

    attribute vec2 position, point;
    uniform vec3 uColor;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = vec4(uWidth * position + point, 0, 1);
      vColor = vec4(uColor.r, uColor.g, uColor.b, 1.0);
    }
  `);
  gl.compileShader(joinVertexShader);
  const joinFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(joinFragmentShader, `
    #version 100
    precision mediump float;

    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vec4(vColor.r, vColor.g, vColor.b, 1.0);
    }
  `);
  gl.compileShader(joinFragmentShader);

  joinProgram = gl.createProgram()!;
  gl.attachShader(joinProgram, joinVertexShader);
  gl.attachShader(joinProgram, joinFragmentShader);
  gl.linkProgram(joinProgram);
  gl.detachShader(joinProgram, joinVertexShader);
  gl.detachShader(joinProgram, joinFragmentShader);
  gl.deleteShader(joinVertexShader);
  gl.deleteShader(joinFragmentShader);
  if (!gl.getProgramParameter(joinProgram, gl.LINK_STATUS)) {
    const linkErrLog = gl.getProgramInfoLog(joinProgram);
    cleanUp();
    console.error(`Join program did not link successfully. Error log: ${linkErrLog}`);
    return;
  }

  // geometry for line joins
  circleBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
  const circleLocation = gl.getAttribLocation(joinProgram, 'position');
  gl.enableVertexAttribArray(circleLocation);
  gl.vertexAttribPointer(circleLocation, 2, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(circleLocation, 0);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(circleInstance),
    gl.STATIC_DRAW,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
  const pointLocation = gl.getAttribLocation(joinProgram, 'point');
  gl.enableVertexAttribArray(pointLocation);
  gl.vertexAttribPointer(pointLocation, 2, gl.FLOAT, false, 0, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.vertexAttribDivisor(pointLocation, 1);

  gl.useProgram(segmentProgram);
  gl.uniform1f(gl.getUniformLocation(segmentProgram, 'uWidth'), 0.022);
  gl.useProgram(joinProgram);
  gl.uniform1f(gl.getUniformLocation(joinProgram, 'uWidth'), 0.022);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
})

function cleanUp() {
  gl.useProgram(null);
  if (circleBuffer) {
    gl.deleteBuffer(circleBuffer);
  }
  if (segmentBuffer) {
    gl.deleteBuffer(segmentBuffer);
  }
  if (pointBuffer) {
    gl.deleteBuffer(pointBuffer);
  }
  if (segmentProgram) {
    gl.deleteProgram(segmentProgram);
  }
  if (joinProgram) {
    gl.deleteProgram(segmentProgram);
  }
}

onUnmounted(() => {
  cleanUp();
})

function togglePaused() {
  paused.value = !paused.value
  if (!paused.value) {
    // console.log('unpause', lastFrame, performance.now(), performance.timeOrigin)
    lastFrame = performance.now();
    window.requestAnimationFrame(draw);
  }
}

</script>

<template>

  <Header />

  <div class="lines px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    
    <h2>Shader playground <div class="button" style="display: inline-block; font-size: 1rem;" @click="togglePaused">{{ paused ? 'Play' : 'Pause' }}</div></h2>

    <canvas ref="canvas" width="1000" height="1200" style="background-color: white;"></canvas>

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
