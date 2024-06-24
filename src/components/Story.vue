<script setup lang="ts">
import { defineAsyncComponent, nextTick, reactive, ref } from 'vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

interface Props {
  path: string, // path relative to @/components/ not including .vue extension
  defaults: Record<string, string | boolean | number | string[]>
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
const isRefreshing = ref(false)

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

function refreshComponent() {
  isRefreshing.value = true
  nextTick(() => {
    isRefreshing.value = false
  })
}

</script>

<template>
  <div class="py-4 flex flex-col gap-2" :id="name">
    <div class="flex justify-between">
      <p class="text-xl">{{ name }}</p>
      <Button variant="text" @click="refreshComponent">
        <Icon name="refresh" class="w-4" />
      </Button>
    </div>
    <div>
      <div v-for="prop in componentProps" class="inline-flex w-fit mr-2 border border-slate-700 whitespace-nowrap my-1">
        <div class="p-2 text-slate-50 bg-slate-800">{{ prop[0] }}</div>
        <div class="p-2">
          <input :type="typeNameToInputType[prop[1].type]" v-model="boundProps[prop[0]]"
            :class="[prop[1].type === 'String' ? 'border-b border-slate-800' : '']" />
        </div>
      </div>
    </div>

    <div v-if="!isRefreshing" class="relative">
      <StoryComponent v-bind="boundProps" :class="classes">
        <template v-for="slot in slots" v-slot:[slot]>
          slot: {{ slot }}
        </template>
      </StoryComponent>
    </div>
  </div>
</template>