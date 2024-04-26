import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(100, 200, 30)

    const barrier = Bodies.rectangle(200, 200, 20, 400, {
      isStatic: true,
      chamfer: {
        radius: 2
      }
    })

    const hill = BodyUtil.isosceles(500, 576.5, 30, 10, {
      isStatic: true
    })

    const noDraw = {
      body: Bodies.rectangle(495, 290, 570, 580, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    LevelEvent.onCollision(engine, walls.right, target, onEnd)

    return [
      walls,
      barrier,
      noDraw,
      hill,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'NoDrawOverhangHill',
  text: "<span>Make the ball touch the right wall</span>"
}

export default level