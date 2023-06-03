import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Vector } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { distance } from "@/ts/draw-mode/Util"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const ball = {
      body: Bodies.circle(30, 30, 20),
      color: Color.TARGET
    }

    const ramp = Body.create({
      isStatic: true,
      parts: [
        Bodies.rectangle(25, 100, 50, 10),
        Bodies.rectangle(135, 147.5, 200, 10, {
          angle: 0.5
        }),
        Bodies.rectangle(500, 400, 300, 10, {
          angle: 0.5
        })
      ]
    })

    const noDraw = {
      body: Bodies.rectangle(400, 350, 800, 500, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: 0.2
    }

    const target = {
      body: Bodies.circle(600, 150, 20, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE
    }

    EndCondition.onCondition(engine, () => {
      return distance(ball.body.position, target.body.position) < 40
    }, onEnd)

    return [
      ball,
      ramp,
      noDraw,
      target
    ]
  },
  id: 'NoDrawRampTarget',
  text: "<p>Make the ball hit the target</p>"
}

export default level