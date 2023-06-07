import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(400, 540, 40)
    
    EndCondition.onCollision(engine, walls.left, target, onEnd)

    return [
      walls,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallOnFloor',
  text: "<p>Make the ball touch the left wall</p>"
}

export default level