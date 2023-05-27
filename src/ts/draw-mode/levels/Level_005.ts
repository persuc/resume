import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Constraint, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const walls = wallCup()
    const target = Bodies.circle(100, 200, 30)

    const barrier = Bodies.rectangle(200, 200, 20, 400, {
      isStatic: true,
      chamfer: {
        radius: 2
      }
    })

    const noDraw = {
      body: Bodies.rectangle(494, 290, 568, 580, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 3,
        }
      }),
      color: Color.NO_DRAW,
      opacity: 0.2
    }

    EndCondition.onCollision(engine, walls.right, target, onEnd)

    return [
      walls,
      barrier,
      noDraw,
      { body: target, color: Color.TARGET }
    ]
  },
  text: "<p>Make the ball touch the right wall</p>"
}

export default level