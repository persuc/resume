import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine, World, Constraint } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {
    const walls = BodyUtil.wallCup()

    const target = Bodies.circle(400, 100, 40)

    const obstacle1 = Bodies.rectangle(250, 300, 300, 20, { isStatic: true })
    const obstacle2 = Bodies.rectangle(550, 300, 300, 20, { isStatic: true })
    const obstacle3 = Bodies.rectangle(400, 500, 200, 20, { isStatic: true })

    const rotatingObstacle = Bodies.rectangle(400, 400, 150, 20, { isStatic: true })
    const constraint = Constraint.create({
      bodyA: rotatingObstacle,
      pointB: { x: 400, y: 400 },
      length: 0,
      stiffness: 0.01,
    })

    World.add(engine.world, [rotatingObstacle, constraint])

    LevelEvent.onCollision(engine, target, walls.floor, onEnd)

    return [
      walls,
      { body: target, color: Color.TARGET },
      { body: obstacle1, color: Color.WALL },
      { body: obstacle2, color: Color.WALL },
      { body: obstacle3, color: Color.WALL },
      { body: rotatingObstacle, color: Color.WALL },
    ]
  },

  id: "RotatingMaze",
  text: "<span>Navigate the ball through the rotating maze!</span>",
}

export default level