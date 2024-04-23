import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Constraint, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(400, 400, 30)

    const rope = Constraint.create({
      pointA: { x: 300, y: 100 },
      bodyB: target
    })

    EndCondition.onCollision(engine, walls.left, target, onEnd)

    return [
      walls,
      rope,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallOnRope',
  text: "<span>Make the ball touch the left wall</span>"
}

export default level