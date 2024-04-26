import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { Color } from "@/ts/draw-mode/Theme"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()

    const ball = Bodies.circle(400, 150, 40)

    const leftWedge = BodyUtil.isosceles(340, 295, 100, 555, {
      isStatic: true
    })

    const rightWedge = BodyUtil.isosceles(460, 295, 100, 555, {
      isStatic: true
    })

    const target = {
      body: Bodies.rectangle(400, 40, 100, 100, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: 0.6
    }

    LevelEvent.onCondition(engine, () => ball.position.y < 120, onEnd)

    return [
      walls,
      { body: ball, color: Color.TARGET },
      target,
      leftWedge,
      rightWedge,
    ]
  },
  id: 'WedgeFork',
  text: "<span>Lift the ball into the target area.</div>"
}

export default level