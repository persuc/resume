<script setup lang="ts">
  import { reactive, ref } from 'vue'
  const MAX_SIZE = 10
  const MIN_SIZE = 2

  enum MODE {
    PLAY,
    ARRANGE
  }

  const state = reactive([] as boolean[])
  const size = ref(3);
  const selectedStone = ref(-1);
  const message = ref('')
  const loading = ref(false)
  const mode = ref(MODE.ARRANGE)

  function start() {
    reset()
    state.push(...new Array(size.value * 9).fill(false))
  }

  function reset() {
    state.splice(0);
    message.value = ''
  }

  function clickPlace(idx: number) {
    switch (mode.value) {
      case MODE.PLAY:
        if (state[idx] === true) {
          selectedStone.value = idx;
          break;
        }

        if (selectedStone.value < 0) {
          break;
        }

        const movedStone = selectedStone.value;
        const jumpedStone = idx > selectedStone.value ? (
            idx / (size.value * 3) === selectedStone.value / (size.value * 3) ? idx - 1 : idx - (size.value * 3)
          ) : (
            idx / (size.value * 3) === selectedStone.value / (size.value * 3) ? idx + 1 : idx + (size.value * 3)
          )
        state[idx] = true
        state[jumpedStone] = false
        state[movedStone] = false
        break;
      case MODE.ARRANGE:
        state[idx] = !state[idx]
        break;
    } 
  }

</script>

<template>
  <div class="solitaire px-8 pt-8" style="max-width: 60rem; margin: 0 auto;">
    <div v-show="state.length === 0 && !loading">
      <p>The game is to remove all but one stone from the board.</p>
      <p>
        The only move you can make is to jump over an adjacent stone, and remove it.
      </p>
    </div>
    <div class="mt-3" v-show="state.length === 0 && !loading">
      <label>Size: </label>
      <input type="number" :min="MIN_SIZE" :max="MAX_SIZE" :value="size" />
      <button @click="start" class="ml-2 px-2">Play</button>
    </div>
    <div v-show="loading">
      Loading...
    </div>
    <div v-show="state.length > 0 && !loading" class="flex hcenter">
      <div class="border br-1 px-3 mb-3 board">
        <div v-for="row in (size * 3)" :key="`row-${row}`" class="flex">
          <div
            v-for="col in (size * 3)"
            :key="`col-${col}`"
            @click="clickPlace(row * size * 3 + col)"
            :class="{
              stone: state[row * size * 3 + col] === true,
              place: true,
            }"
          >
            
          </div>
        </div>
      </div>
    </div>
    <div v-show="message !== ''" class="br-1 py-1 px-3 mt-3 bg-cerulean-superlight" v-html="message"></div>
    <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a>
  </div>
</template>

<style scoped lang="postcss">

.board {
  border: 1pt solid var(--color-border);
  height: min(90vh, 90vw);
  width: min(90vh, 90vw);
  padding-top: 1%;

  & > .flex {
    height: 11%;
    &:not(:last-child) {
      border-bottom: 1pt solid var(--color-border);
    }
  }
}

.place {
  width: 11.11%;
  
  &:not(:last-child) {
    border-right: 1pt solid var(--color-border);
  }
}

.stone {
  background-color: black;
}


@media (max-width: 1024px) {}

.solitaire {
  font-size: 16px;
  & button {
    font-size: 16px;
  }
}

@media screen and (-webkit-min-device-pixel-ratio:0) { 
  select,
  textarea,
  input {
    font-size: 16px;
  }
}
</style>
