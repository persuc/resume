import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()

    const t = Body.create({
      parts: [
        Bodies.rectangle(400, 425, 300, 10),
        Bodies.rectangle(400, 500, 10, 150),
      ]
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

    const noDraw = {
      body: Bodies.rectangle(400, 200, 600, 400, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    const winZone = {
      body: Bodies.rectangle(400, 150, 760, 300, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: NO_DRAW_AREA_OPACITY
    }

    EndCondition.onCollisionDuration(engine, t, winZone.body, 3000, onEnd)

    return [
      walls,
      noDraw,
      winZone,
      { body: t, color: Color.TARGET }
    ]
  },
  id: 'RaiseT',
  text: "<span>Keep the <b style=\"top: -0.25em\">┳</b> in the upper zone for 3 seconds</span>"
}

export default level