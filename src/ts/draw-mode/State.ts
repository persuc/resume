import { themes, type Theme } from "@/ts/draw-mode/Theme"
import { reactive, ref, shallowRef, type Ref } from "vue"

const STATE_KEY = 'drawModeState'

type SerializableState = {
  completed: string[],
  theme: keyof typeof themes
  unlockAllLevels: boolean
}

const defaultState: SerializableState = {
  completed: [],
  theme: 'DARK',
  unlockAllLevels: false
}

export interface DrawModeState {
  completed: Set<string>,
  theme: Ref<Theme>,
  load: () => void
  save: () => void
  unlockAllLevels: Ref<boolean>
}

export function createState(): DrawModeState {
  const state: DrawModeState = {
    completed: reactive(new Set<string>()),
    theme: shallowRef(themes.DARK),
    load: () => loadState(state),
    save: () => saveState(state),
    unlockAllLevels: ref(false),
  }

  return state
}

function loadState(state: DrawModeState) {
  function loadSerialized(serialized: string) {
    const loadedState: SerializableState = JSON.parse(serialized)
    state.completed.clear()
    for (const v of loadedState.completed) {
      state.completed.add(v)
    }
    if (Object.keys(themes).includes(loadedState.theme)) {
      state.theme.value = themes[loadedState.theme]
    } else {
      state.theme.value = themes.DARK
    }
    state.unlockAllLevels.value = loadedState.unlockAllLevels
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

function saveState(state: DrawModeState) {
  const savedState: SerializableState = {
    unlockAllLevels: state.unlockAllLevels.value,
    theme: Object.entries(themes).find(([_, value]) => value === state.theme.value)![0] as keyof typeof themes,
    completed: Array.from(state.completed),
  }
  localStorage.setItem(STATE_KEY, JSON.stringify(savedState))
}

