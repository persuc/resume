<script setup lang="ts">

import Button from '@/components/Button.vue'
import { computed, getCurrentInstance, ref, watch } from 'vue'

interface Props {
  unidirectional?: boolean
  step?: number
  showControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unidirectional: false,
  showControls: false,
  step: 0,
})

const emit = defineEmits(['update:step'])

const step = ref(props.step)

watch(() => props.step, (newValue) => {
  step.value = newValue
})

function updateStep(value: number) {
  step.value = value
  emit('update:step', value)
}

const slots = computed(() => Object.keys(getCurrentInstance()?.slots ?? {}))
const numberedSlots = computed(() => slots.value.map(s => parseInt(s)).filter(s => !isNaN(s)).sort())
const hasNextSlot = computed(() => slots.value.includes((step.value + 2).toString()))
const hasPreviousSlot = computed(() => slots.value.includes((step.value).toString()))


</script>

<template>
  <div class="flex flex-col">
    <div v-for="slot of Object.keys($slots)" :class="{ hidden: (step + 1).toString() != slot }">
      <slot :name="slot"></slot>
    </div>
    <div class="flex items-center">
      <template v-for="ns, i in numberedSlots" class="">
        <div class="bg-gray-200 rounded-full px-2 text-gray-500 transition" :class="{ 'bg-gray-400': step + 1 === ns }">{{
          ns }}
        </div>
        <div v-if="i < numberedSlots.length - 1" class="h-0 mx-2 border-t border-gray-200 grow"></div>
      </template>
    </div>
    <div v-show="showControls" class="flex justify-end">
      <Button @click="updateStep(step - 1)" :class="{ invisible: !hasPreviousSlot }" class="mr-2">Prev</Button>
      <Button @click="updateStep(step + 1)" :class="{ invisible: !hasNextSlot }">Next</Button>
    </div>
  </div>
</template>