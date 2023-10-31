<script setup lang="ts">
import { ref, type Ref } from 'vue'
import Button from '@/components/Button.vue'
import Article from '@/components/Article.vue'
import Rtc from '@/components/Rtc.vue'

const rtc: Ref<undefined | RTCDataChannel> = ref()
const message = ref('')

function onConnected(dataChannel: RTCDataChannel) {
  rtc.value = dataChannel
}

function onMessage(message: MessageEvent<any>) {
  console.log('received', message)
}

function sendMessage() {
  if (rtc.value) {
    rtc.value.send(message.value)
    message.value = ''
  }
}

</script>

<template>
  <Article>
    <Rtc v-show="!rtc" @connected="onConnected" @message="onMessage" />
    <div v-show="rtc">
      <input type="text" v-model="message" class="border-b border-gray-300 mr-2" />
      <Button @click="sendMessage" class="!inline-block max-h-10 !py-0">Send</Button>
    </div>
  </Article>
</template>
