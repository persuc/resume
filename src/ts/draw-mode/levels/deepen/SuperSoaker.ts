import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { addBody, type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(400, 540, 40)

    LevelEvent.onCollision(engine, walls.right, target, onEnd)

    let count = 1
    const shooterPosition = Vector.create(605, 400)
    function addBall() {
      if (count < 1000) {
        if (count % 4 == 0) {
          const projectileBody = Bodies.circle(600, 400, 10)
          addBody(level, projectileBody)
          let direction = Vector.sub(target.position, shooterPosition)
          Vector.normalise(direction)
          direction = Vector.mult(direction, 0.00007)
          Body.applyForce(projectileBody, { x: 605, y: 400 }, direction)
        }
        count++
      }
    }

    LevelEvent.onUpdate(engine, addBall)

    return [
      walls,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'SuperSoaker',
  text: "<span>Make the ball touch the right wall</span>"
}

export default level