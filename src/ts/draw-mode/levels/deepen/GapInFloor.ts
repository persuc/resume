import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"

const levelSpec: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => void) {

    const walls = BodyUtil.wallBox()

    const leftFloor = BodyUtil.rectangleTopLeftCoords(20, 440, 320, 20, {
      isStatic: true,
    })

    const rightFloor = BodyUtil.rectangleTopLeftCoords(460, 440, 320, 20, {
      isStatic: true,
    })

    const noDrawBelow = {
      body: Bodies.rectangle(400, 520, 760, 120, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    const noDrawAbove = {
      body: Bodies.rectangle(400, 240, 120, 440, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    const target = Bodies.circle(200, 400, 40)

    LevelEvent.onCollision(engine, target, walls.right, onEnd)

    return [
      walls,
      { body: leftFloor, color: Color.WALL },
      { body: rightFloor, color: Color.WALL },
      { body: target, color: Color.TARGET },
      noDrawBelow,
      noDrawAbove,
    ]
  },
  id: 'GapInFloor',
  text: "<span>Make the ball touch the right wall</span>"
}

export default levelSpec