import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const levelSpec: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => void) {

    const walls = BodyUtil.wallBox()

    const wall = Bodies.rectangle(600, 400, 20, 400)

    const target = Bodies.circle(400, 540, 40)

    LevelEvent.onCollision(engine, target, walls.right, onEnd)

    return [
      walls,
      { body: wall, color: Color.WALL },
      { body: target, color: Color.TARGET },
    ]
  },
  id: 'UnbracedWall',
  text: "<span>Make the ball touch the right wall</span>"
}

export default levelSpec