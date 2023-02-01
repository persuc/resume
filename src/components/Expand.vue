<script setup lang="ts">

let expand = false

</script>

<template>
  <div class="expand border pb-2" :style="expand ? 'height: auto;' : 'height: 1.1em;'">
    <div @click="expand = !expand">
      <slot name="label"></slot>
    </div>

    <slot></slot>
  </div>
</template>

<style scoped>
.expand {
  transition: height 0.5s;
  overflow: clip;
}
</style>
