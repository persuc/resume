<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ref } from 'vue'

interface Props {
  peerConnection: RTCPeerConnection,
  answer?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['onanswer'])

const sdp = ref('')
const loading = ref(false)
const answerSdp = ref('')

async function acceptOffer() {
  loading.value = true

  await props.peerConnection.setRemoteDescription(new RTCSessionDescription({
    type: props.answer ? 'offer' : 'answer',
    sdp: atob(sdp.value),
  }))
  if (props.answer) {
    const answer = await props.peerConnection.createAnswer()
    console.log('generated answer', answer)
    answerSdp.value = btoa(answer.sdp!)
    await props.peerConnection.setLocalDescription(answer)
    emit('onanswer', answerSdp.value)
  } else {
    emit('onanswer')
  }
  loading.value = false
}
</script>

<template>
  <div>
    <slot />
    <input type="text" v-model="sdp" :disabled="loading" class="border-b border-gray-300 mr-2" />
    <Button @click="acceptOffer" :disabled="!sdp || loading" class="!inline-block max-h-10 !py-0">Connect</Button>
  </div>
</template>

