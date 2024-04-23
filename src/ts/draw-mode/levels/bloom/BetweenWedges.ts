import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallSides()

    const leftBlock = Bodies.rectangle(30, 260, 20, 20, {
      isStatic: true
    })
    const rightBlock = Bodies.rectangle(770, 260, 20, 20, {
      isStatic: true
    })

    const rod = Bodies.rectangle(400, 100, 450, 20)

    const leftWedge = BodyUtil.rightAngle(140, 400, 360, 100, 'NE', {
      isStatic: true
    })

    const rightWedge = BodyUtil.rightAngle(660, 400, 360, 100, 'NW', {
      isStatic: true
    })

    LevelEvent.onCondition(engine, () => rod.position.y > 600, onEnd)

    return [
      walls,
      rod,
      leftWedge,
      rightWedge,
      leftBlock,
      rightBlock
    ]
  },
  id: 'BetweenWedges',
  text: "<span>Fit it through the gap.</span>"
}

export default level