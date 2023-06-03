import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const leftWall = Bodies.rectangle(10, 320, 20, 560)
    const rightWall = Bodies.rectangle(790, 320, 20, 560)

    const wallBody = Body.create({
      isStatic: true,
      parts: [
        leftWall,
        rightWall,
      ],
    })
    const walls = {
      body: wallBody,
      color: Color.WALL,
    }
    const target = Bodies.circle(400, 300, 40, {
      isSleeping: true
    })
    
    EndCondition.onAnyCollision(engine, target, () => {
      target.isSleeping = false
    })

    EndCondition.onCondition(engine, () => target.position.y > 700, onEnd)

    return [
      walls,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'SleepingBall',
  text: "<p>This ball is sleeping. It will awaken when something touches it.</p><br /><p>Make the ball fall.</p>"
}

export default level