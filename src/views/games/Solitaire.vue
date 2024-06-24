<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import Button from '@/components/Button.vue'
import BackButton from '@/components/BackButton.vue'
const MAX_SIZE = 10
const MIN_SIZE = 2

enum MODE {
  PLAY,
  ARRANGE
}

const state = reactive([] as boolean[])
const size = ref(3)
const selectedStone = ref(-1)
const message = ref('')
const loading = ref(false)
const mode = ref(MODE.PLAY)
const memo = new Map<bigint, boolean>()
const idxToBoardPosition: Record<number, number> = {}
const boardPositionToIdx: Record<number, number> = {}
const history = new Uint8Array(32) // move history. There are at most 32 moves in a game
const historyIdx = ref(-1)
const historySize = ref(0)
// for compatibility with browsers that don't support bigint literals
const zero = BigInt(0)
const one = BigInt(1)
const two = BigInt(2)
let currentGame = zero
const jumps = new Uint8Array([
  0b00001000,
  0b00001010,

  0b00001110,

  0b00010010,
  0b00010001,

  0b00100100,
  0b00100110,

  0b00101010,

  0b00101110,
  0b00101101,

  0b00111000,
  0b00111010,

  0b00111100,
  0b00111110,

  0b01000000,
  0b01000001,
  0b01000010,
  0b01000011,

  0b01000100,
  0b01000101,
  0b01000110,
  0b01000111,

  0b01001000,
  0b01001001,
  0b01001010,
  0b01001011,

  0b01001101,
  0b01001110,

  0b01010001,
  0b01010010,

  0b01010100,

  0b01011000,

  0b01011100,
  0b01011101,
  0b01011110,
  0b01011111,

  0b01100000,
  0b01100001,
  0b01100010,
  0b01100011,

  0b01100100,
  0b01100101,
  0b01100110,
  0b01100111,

  0b01101001,

  0b01101101,

  0b01110000,
  0b01110011,

  0b01110100,
  0b01110111,

  0b01111000,
  0b01111001,
  0b01111010,
  0b01111011,

  0b01111100,
  0b01111101,
  0b01111110,
  0b01111111,

  0b10000000,
  0b10000001,
  0b10000010,
  0b10000011,

  0b10000101,
  0b10000111,

  0b10001001,
  0b10001011,

  0b10010100,
  0b10010111,

  0b10011011,

  0b10011101,
  0b10011111,

  0b10101000,
  0b10101011,

  0b10101111,

  0b10110001,
  0b10110011,
])

function loadGame(game: bigint) {
  let col = 0
  let row = 0
  let boardPosition = 0
  let boardPositionMask = BigInt(1)
  for (let i = 0; i < boardSize.value; i++) {
    col = idxToCol(i)
    row = idxToRow(i)
    if (isValidPosition(row, col)) {
      idxToBoardPosition[i] = boardPosition
      boardPositionToIdx[boardPosition] = i
      state[i] = (game & boardPositionMask) > 0
      boardPosition++
      boardPositionMask *= two
    } else {
      state[i] = false
    }
  }
  currentGame = game
}

onMounted(() => {
  window.addEventListener('resize', checkAspect)
  checkAspect()
  start()
})

function start() {
  reset()
  state.push(...new Array(boardSize.value).fill(false))
  const game1 = BigInt("0b111111111111111101111111111111111")
  loadGame(game1)
  isSolvable(currentGame)
}

function reset() {
  state.splice(0)
  historyIdx.value = -1
  historySize.value = 0
  selectedStone.value = -1
  memo.clear()
  message.value = ''
}

function idxToRow(idx: number) {
  return Math.floor(idx / rowSize.value) + 1
}

function idxToCol(idx: number) {
  return idx % rowSize.value + 1
}

function isValidPosition(row: number, col: number) {
  return (col >= size.value && col < size.value * 2) || (row >= size.value && row < size.value * 2)
}

function clickPlace(row: number, col: number) {
  const idx = (row - 1) * rowSize.value + (col - 1)

  if (!isValidPosition(row, col)) {
    return
  }

  switch (mode.value) {
    case MODE.PLAY:
      if (state[idx] === true) {
        if (idx === selectedStone.value) {
          selectedStone.value = -1
        } else {
          selectedStone.value = idx
        }
        break
      }

      if (selectedStone.value < 0) {
        break
      }

      const jumpedStone = idx > selectedStone.value ? (
        row === idxToRow(selectedStone.value) ? idx - 1 : idx - rowSize.value
      ) : (
        row === idxToRow(selectedStone.value) ? idx + 1 : idx + rowSize.value
      )
      const isHorizontal = idxToRow(selectedStone.value) === row
      const isValidDistance = isHorizontal
        ? Math.abs(selectedStone.value - idx) === 2
        : Math.abs(selectedStone.value - idx) === rowSize.value * 2

      if (state[jumpedStone] === false || !isValidDistance) {
        selectedStone.value = -1
        break
      }
      state[idx] = true
      state[jumpedStone] = false
      state[selectedStone.value] = false
      historyIdx.value++
      history[historyIdx.value] = (jumpedStone << 2) | (isHorizontal ? (jumpedStone > idx ? 0 : 1) : (jumpedStone > idx ? 2 : 3))
      historySize.value = historyIdx.value + 1
      currentGame ^= one << BigInt(idxToBoardPosition[idx]) | one << BigInt(idxToBoardPosition[jumpedStone]) | one << BigInt(idxToBoardPosition[selectedStone.value])
      selectedStone.value = -1
      break
    case MODE.ARRANGE:
      state[idx] = !state[idx]
      currentGame ^= BigInt(1 << idxToBoardPosition[idx])
      break
  }

  isSolvable(currentGame)
}

function undo() {
  if (historyIdx.value === -1) {
    return
  }

  const jumpedStone = history[historyIdx.value] >> 2
  const direction = {
    0: 1, // right
    1: -1, // left
    2: rowSize.value, // down
    3: -rowSize.value, // up
  }[history[historyIdx.value] & 3]!

  state[jumpedStone] = true
  state[jumpedStone - direction] = false
  state[jumpedStone + direction] = true

  currentGame ^= one << BigInt(idxToBoardPosition[jumpedStone - direction]) | one << BigInt(idxToBoardPosition[jumpedStone]) | one << BigInt(idxToBoardPosition[jumpedStone + direction])
  selectedStone.value = jumpedStone + direction
  historyIdx.value--
}

function redo() {
  if (historyIdx.value + 1 >= historySize.value) {
    return
  }

  const jumpedStone = history[historyIdx.value + 1] >> 2
  const direction = {
    0: 1, // right
    1: -1, // left
    2: rowSize.value, // down
    3: -rowSize.value, // up
  }[history[historyIdx.value + 1] & 3]!

  state[jumpedStone] = false
  state[jumpedStone - direction] = true
  state[jumpedStone + direction] = false

  currentGame ^= one << BigInt(idxToBoardPosition[jumpedStone - direction]) | one << BigInt(idxToBoardPosition[jumpedStone]) | one << BigInt(idxToBoardPosition[jumpedStone + direction])
  selectedStone.value = jumpedStone + direction
  historyIdx.value++
}

function isSolvable(game: bigint): boolean {

  return false

  if (memo.has(currentGame)) {
    return memo.get(currentGame)!
  }

  let idx = 0
  for (let boardPosition = 0; boardPosition < 33; boardPosition++) {
    idx = boardPositionToIdx[boardPosition]
    let gameWithoutCurrent = game & (one << BigInt(boardPosition))
    if (gameWithoutCurrent === zero) {
      continue
    }

    const conditionsToCheck: {
      jumpedStoneMask: bigint,
      targetStoneMask: bigint
    }[] = []
    // up
    if (idxToBoardPosition[idx - rowSize.value * 2] !== undefined) {
      conditionsToCheck.push({
        jumpedStoneMask: one << BigInt(idxToBoardPosition[idx - rowSize.value]),
        targetStoneMask: one << BigInt(idxToBoardPosition[idx - rowSize.value * 2])
      })
    }
    // down
    if (idxToBoardPosition[idx + rowSize.value * 2] !== undefined) {
      conditionsToCheck.push({
        jumpedStoneMask: one << BigInt(idxToBoardPosition[idx + rowSize.value]),
        targetStoneMask: one << BigInt(idxToBoardPosition[idx + rowSize.value * 2])
      })
    }
    // left
    if (idxToRow(idx) === idxToRow(idx - 2) && idxToBoardPosition[idx - 2] !== undefined) {
      conditionsToCheck.push({
        jumpedStoneMask: one << BigInt(idxToBoardPosition[idx - 1]),
        targetStoneMask: one << BigInt(idxToBoardPosition[idx - 2])
      })
    }
    // right
    if (idxToRow(idx) === idxToRow(idx + 2) && idxToBoardPosition[idx + 2] !== undefined) {
      conditionsToCheck.push({
        jumpedStoneMask: one << BigInt(idxToBoardPosition[idx + 1]),
        targetStoneMask: one << BigInt(idxToBoardPosition[idx + 2])
      })
    }

    for (const c of conditionsToCheck) {
      if ((game & c.jumpedStoneMask) > 0 && (game & c.targetStoneMask) === zero) {
        if (!isSolvable(gameWithoutCurrent ^ (c.jumpedStoneMask | c.targetStoneMask))) {
          memo.set(game, false)
          return false
        }
      }
    }
  }

  memo.set(game, true)
  return true
}

onUnmounted(() => {
  window.removeEventListener('resize', checkAspect)
})

function checkAspect() {
  isVertical.value = window.innerHeight > window.innerWidth
}

const isVertical = ref(false)
const rowSize = computed(() => size.value * 3 - 2)
const boardSize = computed(() => rowSize.value * rowSize.value)

</script>

<template>
  <BackButton />
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
      <Button @click="start" class="ml-2 px-2">Play</Button>
    </div>
    <div v-show="loading">
      Loading...
    </div>
    <div v-show="state.length > 0 && !loading"
      :class="['flex flex-col justify-center items-center gap-8', isVertical ? '' : 'md:flex-row']">
      <div class="board">
        <div v-for="row in (rowSize)" :key="`row-${row}`" :class="{ flex: true }"
          :style="`height: ${100 / (rowSize)}%`">
          <div v-for="col in (rowSize)" :key="`col-${col}`" @click="clickPlace(row, col)"
            :style="`width: ${100 / (rowSize)}%`" :class="{
              stone: state[(row - 1) * (rowSize) + col - 1] === true,
              place: true,
              selected: (row - 1) * (rowSize) + col - 1 === selectedStone,
              border: isValidPosition(row, col)
            }">
          </div>
        </div>
      </div>
      <div :class="['panel']">
        <p>Mode:</p>
        <Button :disabled="mode !== MODE.PLAY" :class="{
          'mb-2': true,
          'cursor-pointer': true,
        }" style="max-width: 10rem;" @click="mode = MODE.PLAY">
          Play
        </Button>
        <Button :disabled="mode !== MODE.ARRANGE" :class="{
          'cursor-pointer': true,
        }" style="max-width: 10rem;" @click="mode = MODE.ARRANGE">
          Arrange
        </Button>
        <p class="mt-2">Controls:</p>
        <Button style="max-width: 10rem;" @click="start">
          Reset
        </Button>
        <Button :disabled="historyIdx === -1" :class="{
          'mt-2': true,
        }" style="max-width: 10rem;" @click="undo">
          Undo
        </Button>
        <Button :disabled="historyIdx >= historySize - 1" :class="{
          'mt-2': true,
        }" style="max-width: 10rem;" @click="redo">
          Redo
        </Button>
        <!-- <p>Solvable: {{ memo.get(currentGame) }}</p> -->
      </div>
    </div>
    <div v-show="message !== ''" class="rounded py-1 px-3 mt-3 bg-sky-100" v-html="message"></div>
    <div class="py-16"></div>
  </div>
</template>

<style scoped lang="postcss">
.board {
  height: min(90vh - 24px, 90vw - 24px);
  width: min(90vh - 24px, 90vw - 24px);
}

.place {
  border-radius: 50%;

  &.border {
    margin: 0.1rem;
    border: 1pt solid rgb(207, 207, 207);
  }
}

.stone {
  background-color: black;

  &.selected {
    border: 4pt solid rgb(90, 90, 255);
  }
}


@media (max-width: 1024px) {}
</style>
