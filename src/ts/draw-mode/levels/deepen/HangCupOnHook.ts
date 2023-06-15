import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => void) {

    const walls = BodyUtil.wallFloor()

    const cup = BodyUtil.bodyCup(200, 340, 120, 240, 20, {
      density: 0.001,
    })

    const cupCollision = Bodies.rectangle(200, 500, 80, 150, {
      collisionFilter: {
        mask: 0,
        category: 2,
      },
    })

    Events.on(engine, 'afterUpdate', () => {
      Body.setPosition(cupCollision, Vector.add(cup.position, { x: -Math.sin(cup.angle) * 10, y: Math.cos(cup.angle) * 10 }))
      Body.setAngle(cupCollision, cup.angle)
    })

    
    const hook = Bodies.rectangle(600, 400, 20, 400, {
      isStatic: true
    })

    EndCondition.onCollision(engine, cupCollision, hook, onEnd)

    return [
      walls,
      { body: cup, color: Color.TARGET },
      hook,
      { body: cupCollision, opacity: 0.5, color: Color.ZONE }
    ]
  },
  id: 'HangCupOnHook',
  text: `<span>Hang the cup on the hook</span>`
}

export default level