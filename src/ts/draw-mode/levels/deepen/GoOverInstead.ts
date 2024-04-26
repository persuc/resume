import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"

// TODO: Some kind of level where it seems possible to push the ball underneath, but actually you have to go voer the obstacles

const levelSpec: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => void) {

    const { floor, left, right } = BodyUtil.wallCupSeparate()

    const platform = BodyUtil.rectangleTopLeftCoords(20, 440, 440, 20, {
      isStatic: true,
    })

    // const noDrawBelow = {
    //   body: Bodies.rectangle(400, 520, 760, 120, {
    //     isStatic: true,
    //     collisionFilter: {
    //       category: 2,
    //       mask: 2,
    //     }
    //   }),
    //   color: Color.NO_DRAW,
    //   opacity: NO_DRAW_AREA_OPACITY
    // }

    const target = Bodies.circle(200, 300, 40)

    LevelEvent.onCollision(engine, target, platform, () => {
      console.log("They collided!")
      LevelEvent.removeEvents(engine, onEnd)
      right.isStatic = false
      // right.force = Vector.create(0.000001, 0)
    })

    LevelEvent.onCollision(engine, target, right, onEnd)

    return [
      floor, left, right,
      { body: platform, color: Color.NO_DRAW },
      { body: target, color: Color.TARGET },
      // noDrawAbove,
    ]
  },
  id: 'GoOverInstead',
  text: "<span>Make the ball touch the right wall</span>"
}

export default levelSpec