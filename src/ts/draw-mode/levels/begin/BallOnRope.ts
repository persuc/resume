import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Constraint, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = wallCup()
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
  text: "<p>Make the ball touch the left wall</p>"
}

export default level