import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = wallCup()
    const target = Bodies.circle(300, 560, 30)
    const hill = Body.create({
      parts: [
        Bodies.rectangle(370, 530, 10, 100, {
          angle: 1
        }),
        Bodies.rectangle(450, 530, 10, 100, {
          angle: -1
        }),
      ]
    })

    EndCondition.onCollision(engine, walls.right, target, onEnd)

    return [
      walls,
      hill,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallBesideHill',
  text: "<p>Make the ball touch the right wall</p>"
}

export default level