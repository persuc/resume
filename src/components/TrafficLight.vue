<!-- This is a toy component, supposed to demonstrate usage of basic DOM manipulation with plain javascript -->

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

const container: Ref<HTMLElement> = ref() as Ref<HTMLElement>

onMounted(() => init(container.value))

const numberOfLights = 3

const lightColours = [
  {
    id: 'red',
    dim: 'darkred',
    bright: 'red',
  },
  {
    id: 'yellow',
    dim: 'darkgoldenrod',
    bright: 'yellow',
  },
  {
    id: 'green',
    dim: 'darkgreen',
    bright: 'chartreuse',
  },
]

const lights: any[] = []

function init(container: HTMLElement) {
  for (let i = 0; i < numberOfLights; i++) {
    const element = document.createElement('div')
    element.setAttribute('class', 'trafficLight')
    const lenses = []
    for (let j = 0; j < lightColours.length; j++) {
      const colour = lightColours[j]
      const lens = document.createElement('div')
      element.appendChild(lens)
      lens.setAttribute('class', colour.id)
      lens.setAttribute('style', `background-color: ${colour.dim}`)
      lenses.push({
        element: lens,
        lensColour: j,
      })
    }
    lights.push({
      illuminated: 0,
      element,
      lenses,
    })

    container.appendChild(element)
  }

  console.log(lights)
}

function reset() {
  for (const light of lights) {
    for (const colour of lightColours) {
      light.element
        .getElementsByClassName(colour.id)[0]
        .setAttribute('style', `background-color: ${colour.dim}`)
    }
  }
}

let discoInterval: number | null = null

function cycle() {
  for (const light of lights) {
    let colour = lightColours[light.illuminated]
    light.element
      .getElementsByClassName(colour.id)[0]
      .setAttribute('style', `background-color: ${colour.dim}`)
  
    // this could be the same one
    const oldIlluminated = light.illuminated
    while (oldIlluminated === light.illuminated) {
      light.illuminated = Math.floor(Math.random() * lightColours.length)
    }
    colour = lightColours[light.illuminated]
  
    light.element
      .getElementsByClassName(colour.id)[0]
      .setAttribute('style', `background-color: ${colour.bright}`)
  }
}

function toggle() {
  if (discoInterval === null) {
    discoInterval = setInterval(() => {
      for (const light of lights) {
        cycle(light)
      }
    }, 250)
  } else {
    clearInterval(discoInterval)
    reset()
    discoInterval = null
  }
}

(window as any).toggle = toggle;
(window as any).cycle = cycle;

</script>

<template>
  <div class="flex" ref="container">
    <button onclick="cycle()" style="margin-right: 0.5rem; height: unset">Cycle</button>
    <button onclick="toggle()" style="margin-right: 0.5rem; height: unset">Toggle</button>
  </div>
</template>

<style>

.trafficLight {
  background: black;
  width: fit-content;
  height: fit-content;
  padding: 0.5rem;
  margin-right: 0.5rem;
}

.trafficLight>div {
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
}

.trafficLight>div:not(first-of-type) {
  margin-top: 0.5rem;
}
</style>