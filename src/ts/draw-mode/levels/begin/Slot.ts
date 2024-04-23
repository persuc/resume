import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
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

    EndCondition.onCondition(engine, () => target.position.x <= 180 || target.position.x >= 620, onEnd)

    return [
      slot,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'Slot',
  text: "<p class=\"mb-0 px-2\">Get the ball out.</p>",
  textBackground: true
}

export default level