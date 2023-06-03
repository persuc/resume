export interface Theme {
  [Color.DEFAULT]: string
  [Color.TARGET]: string
  [Color.DRAW]: string
  [Color.WALL]: string
  [Color.NO_DRAW]: string
  [Color.ZONE]: string
  background: string
  text: string
}

export enum Color {
  DEFAULT,
  TARGET,
  DRAW,
  WALL,
  NO_DRAW,
  ZONE
}

export const DARK: Theme = {
  [Color.DEFAULT]: '#FDFDFD',
  [Color.TARGET]: '#FDAD00',
  [Color.DRAW]: '#FDFDFD',
  [Color.WALL]: '#FDFDFD',
  [Color.NO_DRAW]: '#AF4242',
  [Color.ZONE]: '#4242AF',
  background: '#000000',
  text: '#FAFAFA'
}

export const LIGHT: Theme = {
  [Color.DEFAULT]: '#DADADA',
  [Color.TARGET]: '#FDADA0',
  [Color.DRAW]: '#FFAF77',
  [Color.WALL]: '#DADADA',
  [Color.NO_DRAW]: '#AF4242',
  [Color.ZONE]: '#EFECD2',
  background: '#FCFCFC',
  text: '#2D2D2D'
}

export const MOONLIGHT: Theme = {
  [Color.DEFAULT]: '#EF81EF',
  [Color.TARGET]: '#FD118A',
  [Color.DRAW]: '#A120EF',
  [Color.WALL]: '#2100EF',
  [Color.NO_DRAW]: '#4242AF',
  [Color.ZONE]: '#EF81EF',
  background: '#000040',
  text: '#FEFEFE'
}

export const NAOKI: Theme = {
  [Color.DEFAULT]: '#DD4020',
  [Color.TARGET]: '#FD112A',
  [Color.DRAW]: '#811515',
  [Color.WALL]: '#CA0000',
  [Color.NO_DRAW]: '#AF4242',
  [Color.ZONE]: '#EFA16F',
  background: '#360000',
  text: '#FEFEFE'
}

export const themes = [DARK, LIGHT, MOONLIGHT, NAOKI]