<script setup lang="ts">
interface Props {
  padLabel?: boolean
  padContent?: boolean
}

withDefaults(defineProps<Props>(), {
  padLabel: true,
  padContent: true,
})

</script>

<template>
  <div class="border border-slate-800">
    <div :class="[padContent ? 'p-2' : '']">
      <slot name="content"></slot>
    </div>
    <div :class="['bg-slate-800 text-slate-50', padLabel ? 'p-2' : '']">
      <slot name="label"></slot>
    </div>
  </div>
</template>
