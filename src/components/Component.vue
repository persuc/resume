<script setup lang="ts">
import { reactive, ref, type ComponentInternalInstance } from 'vue'

interface Props {
  // component: ComponentInternalInstance,
  component: any
  defaults: Record<string, string | boolean | number>
  classes?: string
}

const props = defineProps<Props>()

const componentRef = ref(null)

const typeToDefaultValue: Record<string, any> = {
  'Boolean': false,
  'String': '',
  'Number': 0,
  'Array': []
}

const boundProps = reactive(Object.entries((props.component.props ?? {})).reduce((acc, val) => ({
  ...acc,
  [val[0]]: props.defaults[val[0]] !== undefined ? props.defaults[val[0]] : typeToDefaultValue[val[1].type.name]
}), {}))

const name = props.component.__name ?? props.component.__file.match(/.*\/([A-z]+)\.vue/)[1]

const slots: string[] = []
for (const s of props.component.render.toString().matchAll(/_renderSlot\(.*, "(.*)"/g)) {
  slots.push(s[1])
}

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
    
    <component :is="component" v-bind="boundProps" :class="'mt-2 ' + classes">
      <template v-for="slot in slots" v-slot:[slot]>
        slot: {{ slot }}
      </template>
    </component>
  </div>
</template>