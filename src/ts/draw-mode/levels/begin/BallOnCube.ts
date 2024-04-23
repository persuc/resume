import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine, Body } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { CONTROL_KEY } from "@/ts/draw-mode/Config"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => void) {

    const target = Bodies.circle(400, 515, 40)
    LevelEvent.onCondition(engine, () => target.position.y > 700, onEnd)

    return [
      Bodies.rectangle(400, 540, 80, 80, {
        isStatic: true
      }),
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallOnCube',
  text: `<span>Knock the ball off</span><br /><span class="keyLabel">[${CONTROL_KEY.RESTART.label}]</span> to restart, <span class="keyLabel">[${CONTROL_KEY.BACK.label}]</span> to go back, <span class="keyLabel">[${CONTROL_KEY.THEME.label}]</span> to change the theme`
}

export default level