import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const target = Bodies.circle(400, 300, 20)

    const slot = Body.create({
      isStatic: true,
      parts: [
        Bodies.rectangle(400, 140, 400, 280),
        Bodies.rectangle(400, 460, 400, 280),
      ]
    })

    const noDraw = {
      body: Bodies.rectangle(500, 300, 200, 40, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    LevelEvent.onCondition(engine, () => target.position.x <= 180 || target.position.x >= 620, onEnd)

    return [
      slot,
      noDraw,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'SlotNoDraw',
  text: "<p class=\"mb-0 px-2\">Get the ball out.</p>",
  textBackground: true,
}

export default level