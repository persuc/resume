import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = wallCup()
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
  text: "<p>Make the ball touch the right wall.</p>"
}

export default level