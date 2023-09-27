<script setup lang="ts">
interface Props {
  text?: boolean,
  disabled?: boolean,
  slim?: boolean
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
    text ? 'bg-transparent' : (disabled ? 'bg-gray-200' : 'bg-indigo-500'),
    text ? 'hover:bg-gray-200' : (disabled ? '' : 'hover:bg-indigo-400'),
    'flex',
    'items-center',
    text ? 'transition-colors' : '',
    'duration-75'
  ]">
    <slot />
  </div>
</template>