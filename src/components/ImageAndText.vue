<script setup lang="ts">
interface Props {
  image: string,
  rounded?: boolean
  size?: string
  slim?: boolean
  noMargin?: boolean
}

withDefaults(defineProps<Props>(), {
  size: '4rem',
});

</script>

<template>
  <div :class="`flex items-center ${slim ? 'px-2' : 'p-2'}`">
    <img :class="`${noMargin ? '' : 'mr-2'} grow-0`" :src="image"
      :style="`width: ${size}; ${rounded ? 'border-radius: 2rem;' : ''}`" />
    <div class="grow">
      <slot></slot>
    </div>
  </div>
</template>
