<script setup lang="ts">
import Quiz from '@/components/quiz/Quiz.vue'

import quiz001 from '@/ts/quiz/001'

</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center p-8">
    <Quiz :questions="quiz001" />
  </div>
</template>