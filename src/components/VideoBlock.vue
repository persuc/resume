<script setup lang="ts">
import Panel from '@/components/Panel.vue'

interface Props {
  src: string,
}

defineProps<Props>()

</script>

<template>
  <Panel class="my-4">
    <template v-slot:label>
      <slot></slot>
    </template>
    <template v-slot:content>
      <video controls class="md:h-[60vh] max-h-80vh mx-auto" v-bind="$attrs">
        <source :src="src" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </template>
  </Panel>
  <!-- <div class="my-4 flex flex-col justify-center">
  </div> -->
</template>
