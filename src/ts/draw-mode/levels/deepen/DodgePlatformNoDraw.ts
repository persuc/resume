import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"

const levelSpec: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => void) {

    const { floor, left, right } = BodyUtil.wallCupSeparate()

    const platform = BodyUtil.rectangleTopLeftCoords(20, 440, 440, 20, {
      isStatic: true,
    })

    const target = Bodies.circle(200, 300, 40, {
      isSleeping: true,
    })

    LevelEvent.onAnyCollision(engine, target, () => {
      target.isSleeping = false
    })

    const noDraw = {
      body: BodyUtil.rectangleTopLeftCoords(20, 100, 440, 340, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    LevelEvent.onCollision(engine, target, platform, () => {
      LevelEvent.removeEvents(engine, onEnd)
      Body.setStatic(right, false)
      right.force = Vector.create(0.01, -0.2)
      Body.setAngularVelocity(right, 0.08)
    })

    LevelEvent.onCollision(engine, target, right, onEnd)

    return [
      floor, left, right,
      { body: platform, color: Color.NO_DRAW },
      { body: target, color: Color.TARGET },
      noDraw,
    ]
  },
  id: 'DodgePlatformNoDraw',
  text: "<span>Make the ball touch the right wall</span>"
}

export default levelSpec