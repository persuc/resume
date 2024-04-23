import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Vector } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { distance } from "@/ts/draw-mode/Util"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const ball = Bodies.circle(50, 250, 20, {
      isSleeping: true
    })

    EndCondition.onAnyCollision(engine, ball, () => {
      ball.isSleeping = false
    })

    const overhang = Body.create({
      isStatic: true,
      parts: [
        Bodies.rectangle(400, 350, 20, 200),
        Bodies.rectangle(459, 440, 100, 20),
      ]
    })

    const target = {
      body: Bodies.circle(750, 400, 20, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE
    }

    EndCondition.onCondition(engine, () => {
      return distance(ball.position, target.body.position) < 40
    }, onEnd)

    return [
      {
        body: ball,
        color: Color.TARGET
      },
      overhang,
      target
    ]
  },
  id: 'TargetBehindL',
  text: "<span>Make the ball hit the target.</span>",
}

export default level