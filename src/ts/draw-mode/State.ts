import { LEVELS_PER_PAGE, PAGE_MAJORITY_REQUIRED } from "@/ts/draw-mode/Config"
import { specifications } from "@/ts/draw-mode/Level"
import { themes } from "@/ts/draw-mode/Theme"

const STATE_KEY = 'drawModeState'

const defaultState = {
  completed: [] as string[],
  theme: 0,
  unlockAllLevels: false
}
type SerializableState = typeof defaultState

interface State {
  completed: Set<string>,
  theme: number,
  load: () => void
  save: () => void
  hasPageMajority: (page: number) => boolean,
  unlockAllLevels: boolean
  // completedInRange: (start: number, end: number) => number
}

export function createState(): State {
  const state: State = {
    completed: new Set<string>(),
    theme: 0,
    load: () => loadState(state),
    save: () => saveState(state),
    hasPageMajority: (page: number) => hasPageMajority(state, page),
    unlockAllLevels: false,
    // completedInRange: (start: number, end: number) => completedInRange(state, start, end),
  }

  return state
}

function loadState(state: State) {
  function loadSerialized(serialized: string) {
    const loadedState: SerializableState = JSON.parse(serialized)
    state.completed.clear()
    for (const v of loadedState.completed) {
      state.completed.add(v)
    }
    if (loadedState.theme >= themes.length || loadedState.theme < 0) {
      state.theme = 0
    } else {
      state.theme = loadedState.theme
    }
    state.unlockAllLevels = loadedState.unlockAllLevels
  }

  const defaultSerialized = JSON.stringify(defaultState)
  const serializedState: string = localStorage.getItem(STATE_KEY) ?? defaultSerialized
  try {
    loadSerialized(serializedState)
  } catch (e) {
    console.error(
      'Error loading state from local storage:',
      e,
      'falling back to default state'
    )
    console.warn('Serialized state:', serializedState)
    localStorage.removeItem(STATE_KEY)
    loadSerialized(defaultSerialized)
  }
}

function saveState(state: State) {
  const savedState: SerializableState = {
    ...state,
    completed: Array.from(state.completed),
  }
  localStorage.setItem(STATE_KEY, JSON.stringify(savedState))
}

function completedInRange(state: State, start: number, end: number) {
  start = Math.max(start, 0)
  if (start > end) {
    throw new Error("start must be < end")
  }


  let result = 0
  for (let i = start; i < Math.min(specifications.length, end); i++) {
    if (state.completed.has(specifications[i].id)) {
      result++
    }
  }
  return result
}
function hasPageMajority(state: State, page: number): boolean {
  if (page < 0 || state.unlockAllLevels) {
    return true
  }
  return completedInRange(state, page * LEVELS_PER_PAGE, (page + 1) * LEVELS_PER_PAGE) >= PAGE_MAJORITY_REQUIRED
}

