<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text'

interface Props {
  variant?: ButtonVariant
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.disabled && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
      ; (event.target as HTMLElement).click()
  }
}
</script>

<template>
  <div :class="[
    'button flex items-center h-10 w-fit focus:outline-none select-none',
    variant,
    variant === 'primary' ? 'rhomboid mx-6 px-2 bg-gray-800 text-white hover:bg-gray-700' : '',
    variant === 'secondary' ? 'rhomboid mx-6 px-2 bg-gray-200 text-gray-800 hover:bg-gray-300' : '',
    variant === 'outline' ? 'rhomboid outline mx-6 px-2 bg-transparent text-gray-800 hover:text-gray-950' : '',
    variant === 'text' ? 'px-4' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    disabled && (variant === 'primary') ? 'hover:bg-gray-800' : '',
    disabled && (variant === 'secondary') ? 'hover:bg-gray-200' : '',
  ]" :aria-disabled="disabled" :tabindex="disabled ? -1 : 0" @keydown.enter="handleKeyDown"
    @keydown.space="handleKeyDown">
    <slot></slot>
  </div>
</template>