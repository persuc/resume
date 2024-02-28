<script setup lang="ts">
interface Props {
  company: string,
  role: string,
  dateFrom: string,
  dateTo?: string,
  tech: string[]
}

defineProps<Props>()
</script>

<template>
  <div class="mb-3 leading-3">
    <div class="flex justify-between">
      <p class="text-lg mb-0">{{ company }}<span style="font-weight: 300;"> • {{ role }}</span></p><i>{{ dateFrom
      }}{{ dateTo ? ` - ${dateTo}` : '' }}</i>
    </div>
    <template v-for="(t, i) in tech">
      <i>{{ t }}</i>{{ i === tech.length - 1 ? '' : ', ' }}
    </template>
  </div>
</template>
