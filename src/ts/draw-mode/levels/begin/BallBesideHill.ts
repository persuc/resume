import BodyUtil from "@/ts/draw-mode/BodyUtil"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(300, 545, 30)
    const hill = Body.create({
      parts: [
        Bodies.rectangle(370, 530, 10, 100, {
          angle: 1,
          density: 0.01
        }),
        Bodies.rectangle(450, 530, 10, 100, {
          angle: -1,
          density: 0.01
        }),
      ],
    })

    LevelEvent.onCollision(engine, walls.right, target, onEnd)

    return [
      walls,
      hill,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallBesideHill',
  text: "<span>Make the ball touch the right wall</span>"
}

export default level