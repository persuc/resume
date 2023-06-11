export const ASPECT_RATIO = 800 / 600
export const CLEANUP_INTERVAL = 5000
export const MINIMUM_DRAW_DISTANCE = 6
export const LEVELS_PER_PAGE = 6
export const LEVELS_PER_ROW = 3
export const PAGE_MAJORITY_REQUIRED = 3
export const THUMBNAIL_WIDTH = 200
export const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH / ASPECT_RATIO
export const THUMBNAIL_HORIZONTAL_PAD = 30
export const THUMBNAIL_VERTICAL_PAD = 50
export const DEFAULT_FRICTION = 0.01 // matter js default = 0.1
export const DEFAULT_FRICTION_AIR = 0.001 // matter js default = 0.01
export const DEFAULT_FRICTION_STATIC = 0 // matter js default = 0.5
export const DEFAULT_SLOP = 0 // matter js default = 0.05
export const THUMBNAIL_POSITION = new Array(LEVELS_PER_PAGE).fill(null).map((_, i) => ({
  x: (800 - (LEVELS_PER_ROW * THUMBNAIL_WIDTH - (LEVELS_PER_ROW - 1) * THUMBNAIL_HORIZONTAL_PAD)) / 2 + THUMBNAIL_WIDTH / 4 + i % LEVELS_PER_ROW * (THUMBNAIL_WIDTH + THUMBNAIL_HORIZONTAL_PAD),
  y: (600 - (LEVELS_PER_PAGE / LEVELS_PER_ROW * THUMBNAIL_HEIGHT - (LEVELS_PER_PAGE / LEVELS_PER_ROW - 1) * THUMBNAIL_VERTICAL_PAD)) * 3 / 5 + Math.floor(i / LEVELS_PER_ROW) * (THUMBNAIL_HEIGHT + THUMBNAIL_VERTICAL_PAD)
}))
export const NO_DRAW_AREA_OPACITY = 0.4

export const CONTROL_KEY = {
  LEFT: {
    code: 'z',
    altCode: 'ArrowLeft',
    label: 'Z',
  },
  RIGHT: {
    code: 'x',
    altCode: 'ArrowRight',
    label: 'X',
  },
  BACK: {
    code: 'Escape',
    label: 'Esc',
  },
  FORWARD: {
    code: 'Enter',
    altCode: 'Space',
    label: 'Ret',
  },
  RESTART: {
    code: 'r',
    label: 'R',
  },
  THEME: {
    code: 't',
    label: 'T'
  },
  THUMBNAIL_1: {
    code: 'q',
    label: 'Q',
  },
  THUMBNAIL_2: {
    code: 'w',
    label: 'W',
  },
  THUMBNAIL_3: {
    code: 'e',
    label: 'E',
  },
  THUMBNAIL_4: {
    code: 'a',
    label: 'A',
  },
  THUMBNAIL_5: {
    code: 's',
    label: 'S',
  },
  THUMBNAIL_6: {
    code: 'd',
    label: 'D',
  },
}