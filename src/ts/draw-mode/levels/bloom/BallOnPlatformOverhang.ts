import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()

    const ball = Bodies.circle(400, 400, 20)

    const platform = Body.create({
      parts: [
        Bodies.rectangle(400, 440, 200, 20),
        Bodies.rectangle(335, 480, 70, 60),
        Bodies.rectangle(465, 480, 70, 60),
      ],
      isStatic: true
    })

    const winZone = {
      body: Bodies.rectangle(400, 480, 40, 40, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: NO_DRAW_AREA_OPACITY * 1.2
    }


    LevelEvent.onCollisionDuration(engine, ball, winZone.body, 3000, onEnd)

    return [
      platform,
      walls,
      winZone,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'BallOnPlatformOverhang',
  text: "<span>Keep the ball in the target zone for 3 seconds</span>"
}

export default level