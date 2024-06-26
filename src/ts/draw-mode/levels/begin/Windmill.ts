import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Constraint, Engine, Events } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()

    const target = Bodies.circle(100, 560, 20)

    const windmill = Body.create({
      parts: [
        Bodies.rectangle(400, 425, 300, 10),
        Bodies.rectangle(400, 425, 300, 10, {
          angle: Math.PI / 2
        }),
      ]
    })

    const pinJoint = Constraint.create({
      pointA: { x: 400, y: 425 },
      bodyB: windmill,
      length: 0,
      stiffness: 0.9,
    })

    const noDraw = {
      body: Bodies.circle(400, 425, 150, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    function rotateWindmill() {
      Body.setAngularVelocity(windmill, 0.025)
    }

    LevelEvent.onUpdate(engine, rotateWindmill)

    LevelEvent.onCollision(engine, walls.right, target, onEnd)

    return [
      walls,
      pinJoint,
      windmill,
      noDraw,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'Windmill',
  text: "<span>Make the ball touch the right wall.</span>"
}

export default level