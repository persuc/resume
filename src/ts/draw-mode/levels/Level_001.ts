import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine, Body } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => void) {

    const target = Bodies.circle(400, 515, 40)
    EndCondition.onPredicate(engine, target, (target: Body) => target.position.y > 700, onEnd)

    return [
      Bodies.rectangle(400, 540, 80, 80, {
        isStatic: true
      }),
      { body: target, color: Color.TARGET }
    ]
  },
  text: "<span>Knock the ball off</span><br /><span>[R] to restart, [Esc] to go back, [T] to change the theme</span>"
}

export default level