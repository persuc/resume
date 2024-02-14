<script setup lang="ts">
import { defineAsyncComponent, reactive } from 'vue'

interface Props {
  path: string, // path relative to @/components/ not including .vue extension
  defaults: Record<string, string | boolean | number>
  classes?: string
}
type TypeName = 'Boolean' | 'String' | 'Number' | 'Array'
interface TypeFunction extends Function {
  name: TypeName
}
type BasicType = string | boolean | number
type PropType = BasicType | BasicType[]

const props = defineProps<Props>()
const boundProps: Record<string, PropType> = reactive({})
const componentProps: [string, { type: TypeName, required: boolean, default?: PropType }][] = reactive([])
const name = props.path.match(/(.*\/)?([A-z0-9\-\_]+)/)?.[2]
const slots: string[] = reactive([])

const StoryComponent = defineAsyncComponent(() => {
  const asyncImport = import(/* @vite-ignore */ `./${props.path}.vue`)
  asyncImport.then(result => {
    const component = result.default

    for (const match of (component.render ?? '').toString().matchAll(/_renderSlot\(.*, "(.*)"/g)) {
      slots.push(match[1])
    }

    for (const entry of Object.entries(
      (component.props ?? {}) as Record<string, { type: TypeFunction, required: boolean, default?: PropType }>
    )) {
      componentProps.push([entry[0], {
        required: entry[1].required,
        type: entry[1].type.name,
      }])

      if (props.defaults[entry[0]] !== undefined) {
        boundProps[entry[0]] = props.defaults[entry[0]]
      } else if (entry[1].default !== undefined) {
        boundProps[entry[0]] = entry[1].default
      } else {
        boundProps[entry[0]] = typeToDefaultValue[entry[1].type.name]
      }
    }
  })
  return asyncImport
})

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

</script>

<template>
  <div class="p-4" :id="name">
    <p class="text-lg">{{ name }}</p>
    <div v-for="prop in componentProps" class="inline-block mr-2 bg-slate-200 p-2 rounded whitespace-nowrap my-1">
      {{ prop[0] }}
      <input :type="typeNameToInputType[prop[1].type]" v-model="boundProps[prop[0]]"
        :class="`${prop[1].type === 'String' ? 'border-b' : ''} pl-1`" />
    </div>

    <StoryComponent v-bind="boundProps" :class="'mt-2 ' + classes">
      <template v-for="slot in slots" v-slot:[slot]>
        slot: {{ slot }}
      </template>
    </StoryComponent>
  </div>
</template>