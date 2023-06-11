import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const ball = Bodies.circle(760, 400, 20, {
      isSleeping: true
    })

    const barrier = Bodies.rectangle(600, 300, 400, 20, {
      isStatic: true,
    })

    const noDraw = {
      body: Bodies.rectangle(400, 445, 800, 310, {
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
      body: Bodies.rectangle(760, 340, 40, 40, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: 0.6
    }

    EndCondition.onAnyCollision(engine, ball, () => {
      ball.isSleeping = false
    })

    EndCondition.onCollision(engine, ball, target.body, onEnd)

    return [
      target,
      barrier,
      noDraw,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'NoDrawBothUnderneath',
  text: "<span>Make the ball hit the target.</span>"
}

export default level