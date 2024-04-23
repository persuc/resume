import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { Color } from "@/ts/draw-mode/Theme"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallFloor()

    const ball = Bodies.circle(400, 220, 40)

    const leftWedge = BodyUtil.isosceles(340, 395, 100, 555, {
      isStatic: true
    })

    const rightWedge = BodyUtil.isosceles(460, 395, 100, 555, {
      isStatic: true
    })

    const target = {
      body: Bodies.rectangle(400, 80, 800, 160, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: 0.6
    }

    EndCondition.onCondition(engine, () => ball.position.y < 200, onEnd)

    return [
      walls,
      { body: ball, color: Color.TARGET },
      target,
      leftWedge,
      rightWedge,
    ]
  },
  id: 'WedgeFork',
  text: "<span>Lift the ball into the target area.</span><div style=\"\" >Warning! This level is unsolved. If you are the first to solve it, please <a target=\"_blank\" style=\"pointer-events: all\" href=\"https://github.com/andrew-p-dev/resume/issues\">raise an issue</a> to let me know! (You get your name here)</div>"
}

export default level