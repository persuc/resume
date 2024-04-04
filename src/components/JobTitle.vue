<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  company: string,
  role: string,
  roleQualifier?: string,
  dateFrom: string,
  dateTo?: string,
  tech: string[]
}

const props = defineProps<Props>()

const dateString = computed(() => {
  return props.dateFrom + (props.dateTo ? ` - ${props.dateTo}` : '')
})

</script>

<template>
  <div class="mb-2 leading-3">
    <div class="flex justify-between mb-1">
      <div>
        <span class="text-lg">{{ company }}</span>
        <span class="text-lg font-light"> • {{ role }}</span>
        <span class="text-lg font-light hidden md:inline" v-if="roleQualifier"> ({{ roleQualifier }})</span>
      </div>
      <div class="italic hidden md:inline">{{ dateString }}</div>
    </div>
    <!-- <div class="font-light text-lg relative -top-1">{{ role }}</div> -->
    <div class="block md:hidden pt-2 pb-3">
      <div class="italic">{{ dateString }}</div>
    </div>
    <div class="italic border-l border-l-blue-400 bg-sky-50 w-fit p-2 leading-5 print-exact">
      <template v-for="(t, i) in tech">
        {{ t }}{{ i === tech.length - 1 ? '' : ', ' }}
      </template>
    </div>
  </div>
</template>
