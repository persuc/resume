import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const leftWall = Bodies.rectangle(10, 320, 20, 560)
    const rightWall = Bodies.rectangle(790, 320, 20, 560)

    const walls = {
      body: Body.create({
        isStatic: true,
        parts: [
          leftWall,
          rightWall,
        ],
      }),
      color: Color.WALL,
    }
    const ball = Bodies.circle(400, 300, 40, {
      isSleeping: true
    })

    EndCondition.onAnyCollision(engine, ball, () => {
      ball.isSleeping = false
    })

    EndCondition.onCondition(engine, () => ball.position.y > 700, onEnd)

    return [
      walls,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'SleepingBall',
  text: "<span>This ball is sleeping. It will awaken when something touches it.</span><br /><p>Make the ball fall.</p>"
}

export default level