import BodyUtil from "@/ts/draw-mode/BodyUtil"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(400, 540, 30)
    const cup = Body.create({
      parts: [
        Bodies.rectangle(350, 530, 10, 100), // left
        Bodies.rectangle(450, 530, 10, 100), // right
        Bodies.rectangle(400, 485, 100, 10), // top
      ]
    })

    LevelEvent.onCollision(engine, walls.left, target, onEnd)

    return [
      walls,
      cup,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallInCup',
  text: "<span>Make the ball touch the left wall</span>"
}

export default level