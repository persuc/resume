export enum Color {
  DEFAULT = 'DEFAULT',
  TARGET = 'TARGET',
  DRAW = 'DRAW',
  WALL = 'WALL',
  NO_DRAW = 'NO_DRAW',
  ZONE = 'ZONE',
  BACKGROUND = 'BACKGROUND',
  TEXT = 'TEXT',
}

export interface Theme {
  [Color.DEFAULT]: string
  [Color.TARGET]: string
  [Color.DRAW]: string
  [Color.WALL]: string
  [Color.NO_DRAW]: string
  [Color.ZONE]: string
  [Color.BACKGROUND]: string
  [Color.TEXT]: string
}

export const themes: Record<string, Theme> = {
  DARK: {
    DEFAULT: '#FDFDFD',
    TARGET: '#FDAD00',
    DRAW: '#FDFDFD',
    WALL: '#FDFDFD',
    NO_DRAW: '#AF4242',
    ZONE: '#4242AF',
    BACKGROUND: '#000000',
    TEXT: '#FAFAFA'
  },
  LIGHT: {
    DEFAULT: '#DADADA',
    TARGET: '#FDADA0',
    DRAW: '#FFAF77',
    WALL: '#DADADA',
    NO_DRAW: '#AF4242',
    ZONE: '#EFECD2',
    BACKGROUND: '#FCFCFC',
    TEXT: '#2D2D2D'
  },
  MOONLIGHT: {
    DEFAULT: '#EF81EF',
    TARGET: '#FD118A',
    DRAW: '#A120EF',
    WALL: '#2100EF',
    NO_DRAW: '#4242AF',
    ZONE: '#EF81EF',
    BACKGROUND: '#000040',
    TEXT: '#FEFEFE'
  },
  NAOKI: {
    DEFAULT: '#DD4020',
    TARGET: '#FD112A',
    DRAW: '#811515',
    WALL: '#CA0000',
    NO_DRAW: '#AF4242',
    ZONE: '#EFA16F',
    BACKGROUND: '#360000',
    TEXT: '#FEFEFE'
  }
}