<script setup lang="ts">
interface Props {
  text?: boolean,
  disabled?: boolean,
  slim?: boolean
  noHover?: boolean
}

defineProps<Props>()
</script>

<template>
  <div :class="[
    slim ? '' : 'py-3',
    'px-5',
    'uppercase',
    'font-medium',
    'rounded-lg',
    disabled ? 'cursor-default' : 'cursor-pointer',
    text ? 'text-slate-900' : (disabled ? 'text-gray-500' : 'text-white'),
    (() => { // background styles
      if (text) {
        return 'bg-transparent'
      }
      if (disabled) {
        return 'bg-gray-200'
      }
      return 'bg-indigo-500'
    })(),
    (() => { // hover styles
      if (noHover || disabled) {
        return ''
      }
      if (text) {
        return 'hover:bg-gray-200'
      }
      return 'hover:bg-indigo-400'
    })(),
    'flex',
    'items-center',
    text ? 'transition-colors' : '',
    'duration-75'
  ]">
    <slot />
  </div>
</template>