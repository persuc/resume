import BodyUtil from "@/ts/draw-mode/BodyUtil"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const ball = Bodies.circle(120, 410, 20)

    const cannon = BodyUtil.bodyCup(140, 300, 80, 200, 20, {
      isStatic: true,
    })

    Body.setAngle(cannon, -0.7)

    EndCondition.onCollisionDuration(engine, cannon, ball, 500, () => Body.applyForce(ball, { x: 100, y: 400 }, { x: -0.1, y: -0.1 }))

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

    EndCondition.onCollision(engine, ball, target.body, onEnd)

    return [
      cannon,
      target,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'CannonBackwards',
  text: "<span>Hit the target.</span>"
}

export default level