<script setup lang="ts">

type SupportedColor = 'indigo' | 'lime' | 'red' | 'yellow'

interface Props {
  text?: boolean,
  disabled?: boolean,
  slim?: boolean
  noHover?: boolean
  color?: SupportedColor
}

const background: Record<SupportedColor, string> = {
  indigo: 'bg-indigo-500',
  lime: 'bg-lime-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
}

const hover: Record<SupportedColor, string> = {
  indigo: 'hover:bg-indigo-400',
  lime: 'hover:bg-lime-400',
  yellow: 'hover:bg-yellow-400',
  red: 'hover:bg-red-400',
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
      return background[color ?? 'indigo'] ?? background.indigo
    })(),
    (() => { // hover styles
      if (noHover || disabled) {
        return ''
      }
      if (text) {
        return 'hover:bg-gray-200'
      }
      return hover[color ?? 'indigo'] ?? hover.indigo
    })(),
    'flex',
    'items-center',
    text ? 'transition-colors' : '',
    'duration-75'
  ]">
    <slot />
  </div>
</template>