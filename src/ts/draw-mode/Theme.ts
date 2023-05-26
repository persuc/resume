export default interface Theme {
  [Color.DEFAULT]: string
  [Color.TARGET]: string
  [Color.DRAW]: string
  [Color.WALL]: string
}

export enum Color {
  DEFAULT,
  TARGET,
  DRAW,
  WALL,
}

export const DEFAULT: Theme = {
  [Color.DEFAULT]: '#FDFDFD',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#FDFDFD',
  [Color.WALL]: '#FDFDFD'
}

export const DEFAULT_2: Theme = {
  [Color.DEFAULT]: '#FDFDFD',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#FDAD00',
  [Color.WALL]: '#FDFDFD'
}

export const DEFAULT_3: Theme = {
  [Color.DEFAULT]: '#DC00DC',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#2100EF',
  [Color.WALL]: '#111165'
}

export const themes = [DEFAULT, DEFAULT_2, DEFAULT_3]