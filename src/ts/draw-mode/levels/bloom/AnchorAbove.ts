import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const ball = Bodies.circle(150, 350, 20, {
      isSleeping: true
    })

    const anchor = Bodies.circle(400, 100, 30, {
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
      body: Bodies.rectangle(740, 500, 40, 40, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: 0.6
    }

    LevelEvent.onAnyCollision(engine, ball, () => {
      ball.isSleeping = false
    })

    LevelEvent.onCollision(engine, ball, target.body, onEnd)

    return [
      target,
      anchor,
      noDraw,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'AnchorAbove',
  text: "<span>Make the ball hit the target.</span>"
}

export default level