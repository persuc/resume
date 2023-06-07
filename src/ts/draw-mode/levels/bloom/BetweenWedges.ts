import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

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

    EndCondition.onCondition(engine, () => rod.position.y > 600, onEnd)

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
  text: "<p>Fit it through the gap.</p>"
}

export default level