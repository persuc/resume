
<script setup lang="ts">
import { type Ref, ref } from 'vue'
import Button from '@/components/Button.vue'
import CopyButton from '@/components/CopyButton.vue'

interface Props {
  peerConnection: RTCPeerConnection
}

const props = defineProps<Props>()

const offer: RTCSessionDescriptionInit = await props.peerConnection.createOffer()
await props.peerConnection.setLocalDescription(offer)
const token = btoa(offer.sdp!)

console.log('Generated offer', offer)
// const iceCandidates: RTCIceCandidate[] = reactive([])
// const manualCandidate = ref('')

// Listen for local ICE candidates on the local RTCPeerConnection
// peerConnection.addEventListener('icecandidate', event => {
//   if (event.candidate) {
//     iceCandidates.push(event.candidate)
//   }
// })

// watch(iceCandidates, (newValue: RTCIceCandidate[], oldValue: RTCIceCandidate[]) => {
//   if (dataChannel.value) {
//     for (const c of newValue.slice(oldValue.length)) {
//       dataChannel.value.send(JSON.stringify({
//         type: 'candidate',
//         data: c
//       }))
//     }
//   } else if (!oldValue.length) {
//     manualCandidate.value = JSON.stringify(newValue[0])
//   }
// })

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
// async function receiveIceCandidates(candidate: string) {
//   try {
//     await peerConnection.addIceCandidate(JSON.parse(atob(candidate)))
//   } catch (e) {
//     console.error('Error adding received ice candidate', e)
//   }
// }

</script>

<template>
  <div v-show="token">
    <slot />
    <CopyButton :value="token" style="line-height: 1.5em;">
      <span class="p-2 bg-gray-200 break-words mr-30">{{ token }}</span>
    </CopyButton>
  </div>
  <!-- <div v-show="manualCandidate">
    Send this ICE candidate to your partner: <span class="p-2 bg-gray-200">{{ manualCandidate }}</span>
  </div> -->
  <div v-show="!token">
    An error occurred
  </div>
</template>
