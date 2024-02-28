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
  <div>
    <div class="flex justify-between">
      <p class="text-lg print:mb-0">{{ company }}<span style="font-weight: 300;"> • {{ role }}</span></p><i>{{ dateFrom
      }}{{ dateTo ? ` - ${dateTo}` : '' }}</i>
    </div>
    <!-- <span class="ml-2 mr-1" style="font-size: 0.75rem; line-height: 1rem; top: -0.125rem;">⮑</span> -->
    <span class="ml-4 font-bold tech">Tech: </span>
    <!-- <span class="ml-4"></span> -->
    <template v-for="(t, i) in tech">
      <i>{{ t }}</i>{{ i === tech.length - 1 ? '' : ', ' }}
    </template>
  </div>
</template>
