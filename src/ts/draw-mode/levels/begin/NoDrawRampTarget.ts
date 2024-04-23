import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { distance } from "@/ts/draw-mode/Util"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

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
      body: Bodies.rectangle(400, 353, 800, 495, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
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

    LevelEvent.onCondition(engine, () => {
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
  text: "<span>Make the ball hit the target</span>"
}

export default level