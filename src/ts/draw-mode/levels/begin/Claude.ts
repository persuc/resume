import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine, World } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {
    const walls = BodyUtil.wallCup()

    const target = Bodies.circle(400, 100, 40)

    const obstacle1 = Bodies.rectangle(250, 400, 300, 20, { isStatic: true })
    const obstacle2 = Bodies.rectangle(550, 400, 300, 20, { isStatic: true })

    LevelEvent.onCollision(engine, target, walls.floor, onEnd)

    return [
      walls,
      { body: target, color: Color.TARGET },
      { body: obstacle1, color: Color.WALL },
      { body: obstacle2, color: Color.WALL },
    ]
  },

  id: "Claude",
  text: "<span>Get the ball to the bottom!</span>",
}

export default level