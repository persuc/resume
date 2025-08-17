<script setup lang="ts">
import { ref } from 'vue'
import Icon from './Icon.vue'

export interface MenuItem {
  label: string
  icon?: string
  action: () => void
  variant?: 'default' | 'danger'
  separator?: boolean
}

defineProps<{
  items: MenuItem[]
}>()

const isOpen = ref(false)

const toggleMenu = (event: Event) => {
  event.stopPropagation()
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleItemClick = (item: MenuItem, event: Event) => {
  event.stopPropagation()
  item.action()
  closeMenu()
}

</script>

<template>
  <div class="relative" @click.stop>
    <button @click="toggleMenu"
      class="p-2 bg-transparent hover:bg-transparent border-0 border-b-2 transition-colors flex items-center"
      :class="{ 'border-b-4 h-[1.55rem] -top-[0.1rem] !bg-gray-100': isOpen }">
      <Icon name="hamburger" class="w-4 h-4" />
    </button>

    <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 z-10"></div>

    <div v-if="isOpen"
      class="absolute right-6 mt-2 w-48 bg-white rounded-md shadow-lg z-20 rhomboid outline outline-none before:border-2 before:border-gray-800 before:!-skew-x-6 before:!w-[calc(100%+2rem)] before:!-left-4 before:!bg-white">
      <div class="py-1 pb-4">
        <template v-for="(item, index) in items" :key="index">
          <!-- <hr v-if="item.separator && index > 0" class="my-1"> -->
          <button @click="handleItemClick(item, $event)"
            class="flex items-center h-auto w-full text-left px-4 py-2 text-sm transition-colors bg-transparent border-0 border-b-2"
            :class="{
              'text-gray-700 hover:bg-gray-100': item.variant !== 'danger',
              'text-red-600 hover:bg-red-50': item.variant === 'danger'
            }">
            <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4 inline relative top-[0.1em] mr-2" :class="{
              'text-gray-700 hover:bg-gray-100': item.variant !== 'danger',
              'text-red-600 hover:bg-red-50': item.variant === 'danger'
            }" />
            {{ item.label }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>