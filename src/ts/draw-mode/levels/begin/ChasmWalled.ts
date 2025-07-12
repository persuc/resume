import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const ball = Bodies.polygon(75, 100, 3, 20, { isSleeping: true })

    LevelEvent.onAnyCollision(engine, ball, () => {
      ball.isSleeping = false
    })

    const peg = {
      body: Bodies.circle(110, 280, 20, {
        isStatic: true
      }),
      color: Color.WALL,
    }

    const wall = {
      body: Bodies.rectangle(400, 200, 20, 400, {
        isStatic: true,
      }),
      color: Color.WALL,
    }

    const leftCliff = {
      body: Bodies.rectangle(125, 600, 250, 200, {
        isStatic: true
      }),
      color: Color.WALL,
    }

    const rightCliff = {
      body: Bodies.rectangle(675, 600, 250, 200, {
        isStatic: true
      }),
      color: Color.WALL,
    }

    const noDraw = {
      body: Bodies.rectangle(400, 300, 300, 600, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        },
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    LevelEvent.onCondition(engine, () => ball.position.x >= 560 && ball.position.y < 640, onEnd)

    return [
      peg,
      wall,
      leftCliff,
      rightCliff,
      noDraw,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'ChasmWalled',
  text: "<span>Get the ball to the other side</span>"
}

export default level