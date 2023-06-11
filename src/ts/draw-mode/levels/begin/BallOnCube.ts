import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine, Body } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import { CONTROL_KEY } from "@/ts/draw-mode/Config"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => void) {

    const target = Bodies.circle(400, 515, 40)
    EndCondition.onCondition(engine, () => target.position.y > 700, onEnd)

    return [
      Bodies.rectangle(400, 540, 80, 80, {
        isStatic: true
      }),
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallOnCube',
  text: `<span>Knock the ball off</span><br /><span>[${CONTROL_KEY.RESTART.label}] to restart, [${CONTROL_KEY.BACK.label}] to go back, [${CONTROL_KEY.THEME.label}] to change the theme</span>`
}

export default level