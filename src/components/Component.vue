<script setup lang="ts">
import { reactive, type Component } from 'vue'

interface Props {
  // component: Component,
  component: any
  defaults: Record<string, string | boolean | number>
  classes?: string
}

const props = defineProps<Props>()

const boundProps = reactive(Object.entries((props.component.props ?? {})).reduce((acc, val) => ({
  ...acc,
  [val[0]]: props.defaults[val[0]] !== undefined ? props.defaults[val[0]] : {
    'Boolean': false,
    'String': '',
    'Number': 0,
    'Array': []
  }[val[1].type.name]
}), {}))

const name = props.component.__name ?? props.component.__file.match(/.*\/([A-z]+)\.vue/)[1]

</script>

<template>
  <div class="border border-gray-200 rounded p-4">
    <p class="text-lg">{{ name }}</p>
    <div v-for="prop in Object.entries(component.props ?? {})" class="inline-block mr-2 bg-slate-200 p-2 rounded whitespace-nowrap my-1">
      {{ prop[0] }}
      <input
        :type="{
          Boolean: 'checkbox',
          String: 'text',
          Number: 'number',
        }[prop[1].type.name]" v-model="boundProps[prop[0]]"
        :class="`${prop[1].type.name === 'String' ? 'border-b' : ''} pl-1`"
       />
    </div>
    <!-- <hr class="my-4" /> -->
    <component :is="component" v-bind="boundProps" :class="classes">
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        SLOT:{{ name }}
      </template>
    </component>
  </div>
</template>