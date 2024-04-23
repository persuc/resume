import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const levelSpec: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => void) {

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

    LevelEvent.onUpdate(engine, () => {
      Body.setPosition(cupCollision, Vector.add(cup.position, { x: -Math.sin(cup.angle) * 10, y: Math.cos(cup.angle) * 10 }))
      Body.setAngle(cupCollision, cup.angle)
    })

    const hook = Bodies.rectangle(600, 400, 20, 400, {
      isStatic: true
    })

    LevelEvent.onCollision(engine, cupCollision, hook, onEnd)

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

export default levelSpec