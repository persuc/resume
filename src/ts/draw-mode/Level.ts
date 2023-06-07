import Line from "@/ts/draw-mode/MatterLine"
import { Color } from "@/ts/draw-mode/Theme"
import type { Theme } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Composite, type IMousePoint, type Engine, type IBodyDefinition, Constraint } from "matter-js"
import { DEFAULT_FRICTION, DEFAULT_FRICTION_AIR, DEFAULT_FRICTION_STATIC, DEFAULT_SLOP } from "@/ts/draw-mode/Config"

export type ColouredBody = { body: Body, color?: Color, opacity?: number }

export interface LevelSpec {
  id: string,
  generateBodies(engine: Engine, onEnd: () => any): (Body | ColouredBody | Constraint)[],
  text?: string,
  textBackground?: boolean
}

export interface Level {
  engine: Engine
  theme: Theme
  themeMap: Record<number, {
    color: keyof Theme,
    opacity?: number
  }>
  applyTheme(theme: Theme): void
  text?: string
  textBackground: boolean
  line: Line | null
  startLine(point: IMousePoint): void
  drawLine(point: IMousePoint): void
  endLine(): void
  restart(): void
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

export function wallSides(): ColouredBody & {
  left: Body,
  right: Body
} {

  const left = Bodies.rectangle(10, 300, 20, 600)
  const right = Bodies.rectangle(790, 300, 20, 600)

  const body = Body.create({
    isStatic: true,
    parts: [
      left,
      right
    ],
  })
  return {
    body,
    color: Color.WALL,
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
    text: spec.text,
    textBackground: spec.textBackground ?? false,
    line: null,
    startLine(point: IMousePoint) {
      level.line = new Line(level.engine)
      level.line.setColor(level.theme.DRAW)
      level.line.addPoint(point)
    },
    drawLine(point: IMousePoint) {
      if (level.line) {
        level.line.addPoint(point)
      }
    },
    endLine() {
      if (level.line) {
        level.line.end()
        for (const body of [level.line.body].concat(level.line.parts)) {
          level.themeMap[body.id] = {
            color: Color.DRAW,
            opacity: 1
          }
        }

        level.line = null
      } 
    },
  }
  
  setBodies(level, spec.generateBodies(engine, onEnd))
  applyTheme(level, theme)

  return level
}

function applyTheme(level: Level, theme: Theme) {
  level.theme = theme
  if (level.line) {
    level.line.setColor(theme.DRAW)
  }
  for (const body of Composite.allBodies(level.engine.world)) {
    if (level.line?.body === body) {
      continue
    }
    if ((body as any).type === 'constraint') {
      const renderTheme = level.themeMap[body.id]
      body.render.strokeStyle = theme[renderTheme.color ?? Color.DEFAULT]
      body.render.opacity = renderTheme.opacity ?? 1
      continue
    }
    for (const part of body.parts.concat(body)) {
      const renderTheme = level.themeMap[part.id]
      part.render.fillStyle = theme[renderTheme.color ?? Color.DEFAULT]
      part.render.opacity = renderTheme.opacity ?? 1
    }
  }
}

function setBodies(level: Level, bodies: (Body | ColouredBody | Constraint)[]) {
  level.themeMap = {}
  Composite.clear(level.engine.world, false)
  for (const body of bodies) {
    if ((body as any).type === 'constraint') {
      const constraint = body as Constraint
      Composite.add(level.engine.world, constraint)
      level.themeMap[constraint.id] = {
        color: Color.WALL,
        opacity: 1,
      }
      continue
    }
    let color: Color = ('color' in body) ? (body.color as Color) : Color.DEFAULT
    let opacity: number = ('opacity' in body) ? (body.opacity as number) : 1
    let realBody: Body = (('body' in body) ? body.body : body) as Body
    level.themeMap[realBody.id] = {
      color,
      opacity,
    }
    for (const part of realBody.parts) {
      level.themeMap[part.id] = {
        color,
        opacity
      }
    }
    realBody.frictionAir = DEFAULT_FRICTION_AIR
    realBody.frictionStatic = DEFAULT_FRICTION_STATIC
    realBody.friction = DEFAULT_FRICTION
    realBody.slop = DEFAULT_SLOP
    Composite.add(level.engine.world, realBody)
  }
}