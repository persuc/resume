import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const ball = Bodies.circle(400, 515, 30)
    const clutter = new Array(30).fill(null).map((_, i) => Bodies.circle(
      40 + 25 * i, 200, 10
    ))

    EndCondition.onCollision(engine, walls.right, ball, onEnd)

    return [
      ...clutter,
      walls,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'BallUnderClutter',
  text: "<span>Make the ball touch the right wall.</span>"
}

export default level