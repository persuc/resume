<script setup lang="ts">
interface Props {
  src: string,
}

defineProps<Props>()

</script>

<template>
  <div class="my-4 flex flex-col justify-center">
    <video controls class="md:h-[60vh] max-h-80vh" v-bind="$attrs">
      <source :src="src" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <span class="font-italic">
      <slot></slot>
    </span>
  </div>
</template>
