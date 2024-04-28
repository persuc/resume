import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

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
    ]
  },
  id: 'DodgePlatform',
  text: "<span>Make the ball touch the right wall</span>"
}

export default levelSpec