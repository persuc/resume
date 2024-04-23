import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { distance } from "@/ts/draw-mode/Util"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = {
      body: Bodies.rectangle(400, 590, 800, 20, {
        isStatic: true
      }),
      color: Color.WALL
    }
    const ball = Bodies.circle(100, 50, 20)
    const numberOfStilts = 3
    const stilts = new Array(30).fill(null).map((_, i) => Bodies.rectangle(
      40 + (720 / (numberOfStilts - 1)) * i, 290, 10, 400
    ))
    const platform = {
      body: Bodies.rectangle(400, 80, 800, 20),
      color: Color.WALL
    }

    const target = {
      body: Bodies.circle(750, 100, 20, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE
    }

    LevelEvent.onCondition(engine, () => {
      return distance(ball.position, target.body.position) < 40
    }, onEnd)

    return [
      platform,
      ...stilts,
      walls,
      target,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'BallOnStilts',
  text: "<span>Make the ball hit the target.</span>"
}

export default level