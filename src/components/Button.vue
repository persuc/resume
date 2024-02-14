<script setup lang="ts">

type SupportedColor = 'indigo' | 'lime' | 'red' | 'yellow'

interface Props {
  text?: boolean,
  disabled?: boolean,
  slim?: boolean
  noHover?: boolean
  icon?: string
  color?: SupportedColor
}

const background: Record<SupportedColor, string> = {
  indigo: '!border-indigo-500',
  lime: '!border-lime-500',
  yellow: '!border-yellow-500',
  red: '!border-red-500',
}

const hover: Record<SupportedColor, string> = {
  indigo: 'hover:border-indigo-400',
  lime: 'hover:border-lime-400',
  yellow: 'hover:border-yellow-400',
  red: 'hover:border-red-400',
}

defineProps<Props>()
</script>

<template>
  <div :class="[
    slim ? '' : 'py-3',
    'px-5',
    'uppercase',
    'font-medium',
    disabled ? 'cursor-default' : 'cursor-pointer',
    text ? 'text-slate-900' : (disabled ? 'text-gray-500' : 'text-slate-900'),
    (() => { // background styles
      if (text) {
        return ''
      }
      return 'border-l-2 ' + (background[color ?? 'indigo'] ?? background.indigo)
    })(),
    (() => { // hover styles
      if (noHover || disabled) {
        return ''
      }
      if (text) {
        return 'hover:font-serif'
      }
      return hover[color ?? 'indigo'] ?? hover.indigo
    })(),
    'flex',
    'items-center',
    text ? 'transition-colors' : '',
    'duration-75'
  ]">
    <div class="flex gap-x-2 items-center">
      <div v-html="icon ?? '☞'" class="mr-2" style="transform: scale(1.75) translate(0, -10%)" />
      <div class="flex gap-x-2 items-center">
        <slot />
      </div>
    </div>
  </div>
</template>