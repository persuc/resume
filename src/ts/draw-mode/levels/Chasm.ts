import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const target = Bodies.circle(100, 100, 20)

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
    
    EndCondition.onCondition(engine, () => target.position.x >= 560, onEnd)

    return [
      leftCliff,
      rightCliff,
      noDraw,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'Chasm',
  text: "<p>Get the ball to the other side</p>"
}

export default level