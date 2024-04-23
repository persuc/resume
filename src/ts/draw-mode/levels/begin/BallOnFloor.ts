import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(400, 540, 40)
    
    EndCondition.onCollision(engine, walls.left, target, onEnd)

    return [
      walls,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'BallOnFloor',
  text: "<span>Make the ball touch the left wall</span>"
}

export default level