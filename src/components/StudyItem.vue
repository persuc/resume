<script setup lang="ts">
interface Props {
  title: string,
  link: string,
  description?: string,
  category: string,
}

defineProps<Props>()
</script>

<template>
  <div class="flex mb-2">
    <div class="flex-1 mr-4">
      <div>
        <a class="font-mono" target="_blank" :href="link">{{ title }}</a>
        <div class="font-mono sm:hidden my-1">
          <span class="rounded-full bg-gray-100 px-2 py-0.5">
            {{ category }}
          </span>
        </div>
        <div v-if="description" v-html="description" />
        <slot></slot>
      </div>
    </div>
    <div class="w-64 font-mono hidden sm:inline">
      <span class="rounded-full bg-gray-100 px-2 py-0.5">
        {{ category }}
      </span>
    </div>
  </div>
</template>

