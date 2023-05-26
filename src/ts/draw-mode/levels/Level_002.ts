import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = wallCup()
    const target = Bodies.circle(400, 515, 40)
    
    EndCondition.onCollision(engine, walls.floor, target, onEnd)

    return [
      walls,
      Bodies.rectangle(400, 540, 80, 80),
      { body: target, color: Color.TARGET }
    ]
  },
  text: "Knock the ball off"
}

export default level