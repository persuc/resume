<script setup lang="ts">
import type { TextQuestion } from '@/@types/quiz'
import Button from '@/components/Button.vue'
import { ref, type Ref } from 'vue'
import MessageSpool from '../MessageSpool.vue'
import { chooseRandom } from '@/ts/utils'

const props = defineProps<{
  question: TextQuestion,
  hideBody?: boolean,
  denials?: string[],
}>()

const emit = defineEmits(['answer-submitted'])

const guess = ref('')

const message = ref('')

const solved = ref(false)

const spool = ref() as Ref<InstanceType<typeof MessageSpool>>

function answerPicked() {
  const g = guess.value.toLowerCase()
  guess.value = ""
  const nm = (props.question.nearMisses ?? {})
  const previousMessage = message.value
  if (props.question.answers.includes(g)) {
    message.value = "Correct!"
    solved.value = true
    emit('answer-submitted', 1)
  } else if (g in nm) {
    message.value = nm[g]
  } else {
    if (props.denials) {
      message.value = chooseRandom(props.denials)
    } else {
      message.value = 'Incorrect'
    }
  }
  if (message.value === previousMessage) {
    spool.value.forceUpdate()
  }
}

</script>
<template>
  <div>
    <div class="w-full mx-auto">
      <h1 v-show="!hideBody" v-for="bodyLine in props.question.body" :key="bodyLine"
        class="text-xl font-mont font-bold select-none">
        {{
          bodyLine
        }}
      </h1>
      <div v-show="solved && !!props.question.revealedBody" class="flex items-start">
        {{ props.question.revealedBody }}
      </div>
      <div class="flex gap-4 items-start">
        <div>
          <input type="text" v-model="guess"
            class="border-b border-gray-500 lowercase text-xl font-mono outline-none w-full"
            placeholder="Type your answer" @keyup.enter="answerPicked" />
          <MessageSpool ref="spool" :message="message" />
        </div>
        <Button @click="answerPicked">Guess</Button>
        <!-- TODO: add a way of skipping a question -->
        <!-- <Button @click="giveUp">Give up</Button> -->
      </div>
    </div>
  </div>
</template>