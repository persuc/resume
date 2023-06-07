import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import BodyUtil from "@/ts/draw-mode/BodyUtil"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(100, 200, 30)

    const barrier = Bodies.rectangle(200, 200, 20, 400, {
      isStatic: true,
      chamfer: {
        radius: 2
      }
    })

    const noDraw = {
      body: Bodies.rectangle(495, 290, 570, 580, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    EndCondition.onCollision(engine, walls.right, target, onEnd)

    return [
      walls,
      barrier,
      noDraw,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'NoDrawOverhang',
  text: "<p>Make the ball touch the right wall</p>"
}

export default level