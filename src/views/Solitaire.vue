<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
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
    state.push(...new Array(rowSize.value * rowSize.value).fill(false))
  }

  function reset() {
    state.splice(0);
    message.value = ''
  }

  function idxToRow(idx: number) {
    return Math.floor(idx / rowSize.value) + 1
  }

  function clickPlace(row: number, col: number) {
    const idx = (row - 1) * rowSize.value + (col - 1)
    
    if (!(col >= size.value && col < size.value * 2) && !(row >= size.value && row < size.value * 2)) {
      return
    }

    switch (mode.value) {
      case MODE.PLAY:
        if (state[idx] === true) {
          if (idx === selectedStone.value) {
            selectedStone.value = -1;  
          } else {
            selectedStone.value = idx;
          }
          break;
        }

        if (selectedStone.value < 0) {
          break;
        }

        const jumpedStone = idx > selectedStone.value ? (
            row === idxToRow(selectedStone.value) ? idx - 1 : idx - rowSize.value
          ) : (
            row === idxToRow(selectedStone.value) ? idx + 1 : idx + rowSize.value
          )
        const isValidDistance = idxToRow(selectedStone.value) === row
          ? Math.abs(selectedStone.value - idx) === 2
          : Math.abs(selectedStone.value - idx) === rowSize.value * 2

        // console.log(selectedStone.value, jumpedStone, idx, idxToRow(jumpedStone) === row, Math.abs(jumpedStone - idx) === 2)
        
        if (state[jumpedStone] === false || !isValidDistance) {
          selectedStone.value = -1
          return
        }
        state[idx] = true
        state[jumpedStone] = false
        state[selectedStone.value] = false
        selectedStone.value = -1;
        break;
      case MODE.ARRANGE:
        state[idx] = !state[idx]
        break;
    } 
  }

  const isVertical = computed(() => window.innerHeight > window.innerWidth)
  const rowSize = computed(() => size.value * 3 - 2)

</script>

<template>
  <div class="solitaire px-8 pt-8">
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
    <div v-show="state.length > 0 && !loading" class="flex" :style="`flex-direction: ${isVertical ? 'column' : 'row'}`">
      <div class="panel"></div>
      <div class="board">
        <div v-for="row in (size * 3 - 2)" :key="`row-${row}`" class="flex" :style="`height: ${100 / (size * 3 - 2)}%`">
          <div
            v-for="col in (size * 3 - 2)"
            :key="`col-${col}`"
            @click="clickPlace(row, col)"
            :style="`width: ${100 / (size * 3 - 2)}%`"
            :class="{
              stone: state[(row - 1) * (size * 3 - 2) + col - 1] === true,
              place: true,
              selected: (row - 1) * (size * 3 - 2) + col - 1 === selectedStone,
              br: (row > size - 1 && row < size * 2) || (col >= size - 1 && col < size * 2),
              bb: (row > size - 2 && row < size * 2) || (col >= size && col < size * 2),
              bt: row === 1 && col >= size && col < size * 2,
              bl: col === 1 && row >= size && row < size * 2,
            }"
          >
          </div>
        </div>
      </div>
      <div class="panel">
        <div
          class="button mb-2"
          :style="`
            width: 10rem;
            background-color: var(${mode === MODE.PLAY ? '--color-anchor' : '--color-background-mute'});
            color: var(${mode === MODE.PLAY ? '--vt-c-text-dark-1' : '--color-text'});
          `"
          @click="mode = MODE.PLAY"
        >
          Play
        </div>
        <div
          class="button"
          :style="`
            width: 10rem;
            background-color: var(${mode === MODE.ARRANGE ? '--color-anchor' : '--color-background-mute'});
            color: var(${mode === MODE.ARRANGE ? '--vt-c-text-dark-1' : '--color-text'});
          `"
          @click="mode = MODE.ARRANGE"
        >
          Arrange
        </div>
      </div>
    </div>
    <div v-show="message !== ''" class="br-1 py-1 px-3 mt-3 bg-cerulean-superlight" v-html="message"></div>
    <a href="/bored" class="nohover" style="display: block; width: fit-content; position: relative; left: -32px;"><div class="pt-2 pb-4 px-8 mb-4" style="margin-top: 20vh">&lt; Back</div></a>
  </div>
</template>

<style scoped lang="postcss">

.board {
  height: min(90vh, 90vw);
  width: min(90vh, 90vw);
  padding-top: 1%;
}

.panel {
  flex-grow: 1;
}

.place {
  &.bt {
    border-top: 1pt solid var(--color-border);
  }
  &.bl {
    border-left: 1pt solid var(--color-border);
  }
  &.bb {
    border-bottom: 1pt solid var(--color-border);
  }
  &.br {
    border-right: 1pt solid var(--color-border);
  }
}

.stone {
  background-color: black;
  &.selected {
    border: 4pt solid rgb(90, 90, 255);
  }
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
