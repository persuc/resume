export interface Theme {
  [Color.DEFAULT]: string
  [Color.TARGET]: string
  [Color.DRAW]: string
  [Color.WALL]: string
  [Color.NO_DRAW]: string
  background: string
  text: string
}

export enum Color {
  DEFAULT,
  TARGET,
  DRAW,
  WALL,
  NO_DRAW,
}

export const DARK: Theme = {
  [Color.DEFAULT]: '#FDFDFD',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#FDFDFD',
  [Color.WALL]: '#FDFDFD',
  [Color.NO_DRAW]: '#AF4242',
  background: '#000000',
  text: '#FAFAFA'
}

export const LIGHT: Theme = {
  [Color.DEFAULT]: '#FDFDFD',
  [Color.TARGET]: '#FDADA0',
  [Color.DRAW]: '#FFAF77',
  [Color.WALL]: '#DADADA',
  [Color.NO_DRAW]: '#AF4242',
  background: '#FCFCFC',
  text: '#2D2D2D'
}

export const MOONLIGHT: Theme = {
  [Color.DEFAULT]: '#DC00DC',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#2100EF',
  [Color.WALL]: '#111165',
  [Color.NO_DRAW]: '#4242AF',
  background: '#00004A',
  text: '#FEFEFE'
}

export const themes = [DARK, LIGHT, MOONLIGHT]