import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const ball = Bodies.circle(100, 100, 20)

    const leftCliff = {
      body: Bodies.rectangle(125, 450, 250, 300, {
        isStatic: true
      }),
      color: Color.WALL,
    }

    const rightCliff = {
      body: Bodies.rectangle(675, 500, 250, 200, {
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
      leftCliff,
      rightCliff,
      noDraw,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'Chasm',
  text: "<span>Get the ball to the other side</span>"
}

export default level