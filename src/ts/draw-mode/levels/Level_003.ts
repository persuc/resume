import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = wallCup()
    const target = Bodies.circle(400, 515, 30)
    const cup = Body.create({
      parts: [
        Bodies.rectangle(350, 530, 10, 100), // left
        Bodies.rectangle(450, 530, 10, 100), // right
        Bodies.rectangle(400, 485, 100, 10), // top
      ]
    })

    EndCondition.onCollision(engine, walls.left, target, onEnd)

    return [
      walls,
      cup,
      { body: target, color: Color.TARGET }
    ]
  },
  text: "<p>Make the ball touch the left wall</p>"
}

export default level