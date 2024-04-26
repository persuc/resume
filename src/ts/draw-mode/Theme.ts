export enum Color {
  DEFAULT = 'DEFAULT', // color used when no color is set
  TARGET = 'TARGET', // color of main interactable object
  DRAW = 'DRAW', // color of objects drawn by player
  WALL = 'WALL', // color of walls and other obstacles
  NO_DRAW = 'NO_DRAW', // color of area which forbids drawing
  ZONE = 'ZONE', // color of zones other than no-draw zones
  BACKGROUND = 'BACKGROUND', // background color
  TEXT = 'TEXT', // text colour
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
    DEFAULT: '#32104D',
    TARGET: '#F6DAF5',
    DRAW: '#984DAB',
    WALL: '#32104D',
    NO_DRAW: '#453F54',
    ZONE: '#6A2781',
    BACKGROUND: '#080321',
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
  },
  VERDANT: {
    DEFAULT: '#3F5E30',
    TARGET: '#DA4031',
    DRAW: '#3F5E30',
    WALL: '#3F5E30',
    NO_DRAW: '#AF4242',
    ZONE: '#4242AF',
    BACKGROUND: '#C4DD78',
    TEXT: '#3F5E30'
  }
}