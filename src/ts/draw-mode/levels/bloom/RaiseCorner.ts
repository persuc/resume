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

    const corner = Body.create({
      parts: [
        Bodies.rectangle(705, 408, 150, 10, {
          angle: 0.40
        }),
        Bodies.rectangle(745, 500, 10, 150, {
          angle: 0.40
        }),
      ]
    })

    const blocker = Bodies.rectangle(590, 150, 20, 300, {
      isStatic: true
    })

    // const windmill = Body.create({
    //   parts: [
    //     Bodies.rectangle(400, 120, 100, 10),
    //     Bodies.rectangle(400, 120, 10, 100),
    //   ]
    // })

    // Events.on(engine, 'afterUpdate', () => {
    //   if (windmill.angularVelocity < 0.1) {
    //     Body.applyForce(windmill, { x: 380, y: 110 }, { x: 0.1, y: 0 })
    //   }
    // })

    // const pinJoint = Constraint.create({
    //   pointA: { x: 400, y: 120 },
    //   bodyB: windmill,
    //   length: 0,
    //   stiffness: 0.9,
    // })

    const winZone = {
      body: Bodies.rectangle(690, 100, 180, 200, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: NO_DRAW_AREA_OPACITY
    }

    const noDraw = {
      body: Bodies.rectangle(690, 300, 180, 200, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    LevelEvent.onCollisionDuration(engine, corner, winZone.body, 3000, onEnd)

    return [
      walls,
      noDraw,
      blocker,
      winZone,
      { body: corner, color: Color.TARGET }
    ]
  },
  id: 'RaiseCorner',
  text: "<span>Keep the <div style=\"transform: rotate(180deg); display: inline-block; font-weight: 1000; font-size: 1.5em; top: 0.1em;\">∟</div> in the upper zone for 3 seconds</span>"
}

export default level