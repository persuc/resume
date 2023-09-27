<script setup lang="ts">
import type { FunctionalComponent, Renderer } from 'vue'
import { reactive, type ComponentInternalInstance } from 'vue'

interface Props {
  component: ComponentInternalInstance & FunctionalComponent & Renderer,
  defaults: Record<string, string | boolean | number>
  classes?: string
}
type TypeName = 'Boolean' | 'String' | 'Number' | 'Array'
interface TypeFunction extends Function {
    name: TypeName;
}
type BasicType = string | boolean | number
type PropType = BasicType | BasicType[]

const props = defineProps<Props>()
const componentProps = Object.entries(
  props.component.props ?? {}
) as [string, { type: TypeFunction, required: boolean }][]

const typeToDefaultValue: Record<TypeName, PropType> = {
  'Boolean': false,
  'String': '',
  'Number': 0,
  'Array': []
}

const typeNameToInputType: Record<string, string> = {
  Boolean: 'checkbox',
  String: 'text',
  Number: 'number',
}

const boundProps = reactive(
  componentProps.reduce((acc, val) => ({
      ...acc,
      [val[0]]: props.defaults[val[0]] !== undefined ? props.defaults[val[0]] : typeToDefaultValue[val[1].type.name]
    }), {} as Record<string, PropType>)
  )

const name = props.component.__file?.match(/.*\/([A-z]+)\.vue/)?.[1]

const slots = Array.from(
  props.component.render.toString().matchAll(/_renderSlot\(.*, "(.*)"/g)
).map(match => match[1])

</script>

<template>
  <div class="border border-gray-200 rounded p-4">
    <p class="text-lg">{{ name }}</p>
    <div v-for="prop in componentProps" class="inline-block mr-2 bg-slate-200 p-2 rounded whitespace-nowrap my-1">
      {{ prop[0] }}
      <input
        :type="typeNameToInputType[prop[1].type.name as string]" v-model="boundProps[prop[0]]"
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