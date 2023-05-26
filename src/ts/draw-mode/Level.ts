import { Color } from "@/ts/draw-mode/Theme"
import type Theme from "@/ts/draw-mode/Theme"
import { Bodies, Body, Composite, type Engine, type IBodyDefinition } from "matter-js"

export type ColouredBody = { body: Body, color?: Color, compound?: boolean }

export interface LevelSpec {
  generateBodies(engine: Engine, onEnd: () => any): (Body | ColouredBody)[],
  text?: string
}

export interface Level {
  engine: Engine
  themeMap: Record<number, keyof Theme>
  applyTheme(theme: Theme): void,
  restart(): void
  theme: Theme,
  text?: string
}

export const bodyOpts: IBodyDefinition = {
  render: {
    fillStyle: '#FFFFFF'
  }
}

export function wallCup(): ColouredBody & {
  floor: Body,
  left: Body,
  right: Body
} {

  const floor = Bodies.rectangle(400, 590, 762, 20)
  const left = Bodies.rectangle(10, 300, 20, 600)
  const right = Bodies.rectangle(790, 300, 20, 600)

  const body = Body.create({
    isStatic: true,
    parts: [
      floor,
      left,
      right
    ],
  })
  return {
    body,
    color: Color.WALL,
    floor,
    left,
    right,
  } 
}
  

export function startLevel(engine: Engine, spec: LevelSpec, theme: Theme, onEnd: () => any): Level {
  const level: Level = {
    engine,
    themeMap: {},
    applyTheme(theme: Theme) {
      applyTheme(level, theme)
    },
    restart() {
      setBodies(level, spec.generateBodies(engine, onEnd))
      applyTheme(level, level.theme)
    },
    theme,
    text: spec.text
  }
  
  setBodies(level, spec.generateBodies(engine, onEnd))
  applyTheme(level, theme)

  return level
}

function applyTheme(level: Level, theme: Theme) {
  level.theme = theme
  for (const body of Composite.allBodies(level.engine.world)) {
    body.render.fillStyle = theme[level.themeMap[body.id] ?? Color.DEFAULT]
    for (const part of body.parts) {
      part.render.fillStyle = theme[level.themeMap[part.id] ?? Color.DEFAULT]
    }
  }
}

function setBodies(level: Level, bodies: (Body | ColouredBody)[]) {
  level.themeMap = {}
  Composite.clear(level.engine.world, false)
  for (const body of bodies) {
    let color: Color = ('color' in body) ? (body.color as Color) : Color.DEFAULT
    let realBody: Body = ('body' in body) ? (body.body as Body) : body
    level.themeMap[realBody.id] = color
    for (const part of realBody.parts) {
      level.themeMap[part.id] = color
    }
    Composite.add(level.engine.world, realBody)
  }
}