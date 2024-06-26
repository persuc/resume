import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies, Body, Constraint, Engine, Events } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import { Color } from "@/ts/draw-mode/Theme"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {


    const ball = Bodies.circle(100, 410, 20)

    const cannon = BodyUtil.bodyCup(100, 300, 80, 200, 20, {
      isStatic: true,
    })

    Body.setAngle(cannon, 0.7)

    LevelEvent.onCollisionDuration(engine, cannon, ball, 500, () => Body.applyForce(ball, { x: 100, y: 400 }, { x: 0.1, y: -0.1 }))


    const target = {
      body: Bodies.rectangle(600, 500, 40, 40, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: 0.6
    }

    LevelEvent.onCollision(engine, ball, target.body, onEnd)

    return [
      cannon,
      target,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'Cannon',
  text: "<span>Hit the target.</span>"
}

export default level