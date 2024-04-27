import Line from "@/ts/draw-mode/MatterLine"
import { Color } from "@/ts/draw-mode/Theme"
import type { Theme } from "@/ts/draw-mode/Theme"
import { Body, Composite, type IMousePoint, type Engine, Constraint, Vector } from "matter-js"
import { DEFAULT_FRICTION, DEFAULT_FRICTION_AIR, DEFAULT_FRICTION_STATIC, DEFAULT_RESTITUTION, DEFAULT_SLOP } from "@/ts/draw-mode/Config"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import type { Replay } from "@/ts/draw-mode/Replay"
import saveAs from "file-saver"
import { cleanUpLevelEvents } from "@/ts/draw-mode/LevelEvent"
import type MatterLine from "@/ts/draw-mode/MatterLine"

export type ColouredBody = { body: Body | Composite, color?: Color, opacity?: number }

export interface LevelSpec {
  id: string,
  generateBodies(engine: Engine, level: Level, onEnd: () => any): (Body | ColouredBody | Constraint)[],
  text?: string,
  textBackground?: boolean
}

export interface Level {
  engine: Engine
  spec: LevelSpec
  theme: Theme
  themeMap: Record<number, {
    color: keyof Theme,
    opacity?: number
  }>
  applyTheme(theme: Theme): void
  text?: string
  textBackground: boolean
  line: Line | null
  startTime: number
  startLine(): Line
  drawLine(point: IMousePoint): void
  saveReplay(): void
  endLine(): void
  lineHistory: Replay['lineHistory']
  restart(): void
  cleanUp(): void
}

export function createLevel(engine: Engine, spec: LevelSpec, theme: Theme, onEnd: () => any, onLineDrawn?: (line: MatterLine) => void): Level {
  const level: Level = {
    engine,
    spec,
    themeMap: {},
    theme,
    text: spec.text,
    textBackground: spec.textBackground ?? false,
    line: null,
    lineHistory: [],
    startTime: performance.now(),
    startLine(): Line {
      level.line = new Line(level.engine)
      level.line.setColor(level.theme.DRAW)
      return level.line
    },
    drawLine(point: IMousePoint) {
      if (level.line) {
        if (level.line.addPoint(point) && (onLineDrawn !== undefined)) {
          onLineDrawn(level.line)
        }
      }
    },
    endLine() {
      if (level.line) {
        this.lineHistory.push(level.line.end().map(l => ({
          position: l.position,
          from: l.from,
          time: l.time - level.startTime
        })))
        for (const body of [level.line.body].concat(level.line.parts)) {
          level.themeMap[body.id] = {
            color: Color.DRAW,
            opacity: 1
          }
        }
        level.line = null
      }
    },
    restart() {
      cleanUp(level)
      setBodies(level, spec.generateBodies(engine, this, onEnd))
      applyTheme(level, level.theme),
        level.lineHistory = []
      level.startTime = performance.now()
    },
    cleanUp() {
      cleanUp(level)
    },
    applyTheme(theme: Theme) {
      applyTheme(level, theme)
    },
    saveReplay() {
      saveAs(
        new Blob([
          JSON.stringify({
            lineHistory: level.lineHistory,
            specId: level.spec.id,
          })],
          { type: "text/plain;charset=utf-8" }
        ),
        `${level.spec.id}.replay`
      )
    },
  }

  setBodies(level, spec.generateBodies(engine, level, onEnd))
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
    addBody(level, body)
  }
}

export function addBody(level: Level, body: Body | ColouredBody | Constraint) {
  if (BodyUtil.isConstraint(body)) {
    const constraint = body as Constraint
    Composite.add(level.engine.world, constraint)
    level.themeMap[constraint.id] = {
      color: Color.WALL,
      opacity: 1,
    }
    return
  }
  let color: Color = ('color' in body) ? (body.color as Color) : Color.DEFAULT
  let opacity: number = ('opacity' in body) ? (body.opacity as number) : 1
  let unwrappedBody: Body | Composite = 'body' in body ? body.body : body
  level.themeMap[unwrappedBody.id] = {
    color,
    opacity,
  }
  const parts = [unwrappedBody]
  if (BodyUtil.isBody(unwrappedBody)) {
    parts.push(...unwrappedBody.parts)
    setPhysics(unwrappedBody)
  } else if (BodyUtil.isComposite(unwrappedBody)) {
    for (const part of unwrappedBody.bodies.flatMap(b => b.parts)) {
      parts.push(part)
      setPhysics(part)
    }
    for (const constraint of unwrappedBody.constraints) {
      Composite.add(level.engine.world, constraint)
    }
  }
  for (const part of parts) {
    level.themeMap[part.id] = {
      color,
      opacity
    }
  }
  Composite.add(level.engine.world, unwrappedBody)
}

export function removeBody(level: Level, body: Body | ColouredBody | Constraint) {
  if (BodyUtil.isConstraint(body)) {
    const constraint = body as Constraint
    Composite.remove(level.engine.world, constraint)
    delete level.themeMap[constraint.id]
    return
  }

  let unwrappedBody: Body | Composite = 'body' in body ? body.body : body
  delete level.themeMap[unwrappedBody.id]
  const parts = [unwrappedBody]
  if (BodyUtil.isBody(unwrappedBody)) {
    parts.push(...unwrappedBody.parts)
  } else if (BodyUtil.isComposite(unwrappedBody)) {
    parts.push(...unwrappedBody.bodies.flatMap(b => b.parts))
    for (const constraint of unwrappedBody.constraints) {
      Composite.remove(level.engine.world, constraint)
    }
  }
  for (const part of parts) {
    delete level.themeMap[part.id]
  }
  Composite.remove(level.engine.world, unwrappedBody)
}

function setPhysics(body: Body) {
  body.frictionAir = DEFAULT_FRICTION_AIR
  body.frictionStatic = DEFAULT_FRICTION_STATIC
  body.friction = DEFAULT_FRICTION
  body.slop = DEFAULT_SLOP
  body.restitution = DEFAULT_RESTITUTION
}

function cleanUp(level: Level) {
  cleanUpLevelEvents(level.engine)
  if (level.line) {
    level.endLine()
  }
}