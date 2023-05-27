export default interface Theme {
  [Color.DEFAULT]: string
  [Color.TARGET]: string
  [Color.DRAW]: string
  [Color.WALL]: string
  [Color.NO_DRAW]: string
}

export enum Color {
  DEFAULT,
  TARGET,
  DRAW,
  WALL,
  NO_DRAW,
}

export const DEFAULT: Theme = {
  [Color.DEFAULT]: '#FDFDFD',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#FDFDFD',
  [Color.WALL]: '#FDFDFD',
  [Color.NO_DRAW]: '#AF4242'
}

export const DEFAULT_2: Theme = {
  [Color.DEFAULT]: '#FDFDFD',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#FDAD00',
  [Color.WALL]: '#FDFDFD',
  [Color.NO_DRAW]: '#AF4242'
}

export const DEFAULT_3: Theme = {
  [Color.DEFAULT]: '#DC00DC',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#2100EF',
  [Color.WALL]: '#111165',
  [Color.NO_DRAW]: '#4242AF'
}

export const themes = [DEFAULT, DEFAULT_2, DEFAULT_3]