import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Vector } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { addBody, removeBody, type Level } from "@/ts/draw-mode/Level"
import { distance } from "@/ts/draw-mode/Util"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()
    const target = Bodies.circle(400, 540, 40)

    LevelEvent.onCollision(engine, walls.right, target, onEnd)

    let frameCount = 0
    const shooterPosition = Vector.create(650, 500)
    type Projectile = { time: number, body: Body }
    let projectiles: Projectile[] = []
    const projectileLifetime = 10000
    function addBall() {
      const currentTime = performance.now()
      frameCount = (frameCount + 1) % 4

      if (frameCount == 0 && distance(shooterPosition, target.position) < 225) {
        const projectileBody = Bodies.circle(shooterPosition.x, shooterPosition.y, 10, {
          density: 0.005,
        })
        projectiles.push({
          time: currentTime,
          body: projectileBody
        })
        addBody(level, projectileBody)
        let direction = Vector.sub(target.position, shooterPosition)
        Vector.normalise(direction)
        // direction = Vector.mult(direction, 0.00007)
        direction = Vector.mult(direction, 0.0001)
        Body.applyForce(projectileBody, { x: 605, y: 400 }, direction)
      }


      const projectilesToKeep: Projectile[] = []
      for (const projectile of projectiles) {
        if (currentTime - projectile.time >= projectileLifetime) {
          removeBody(level, projectile.body)
        } else {
          projectilesToKeep.push(projectile)
        }
      }
      projectiles = projectilesToKeep
    }

    LevelEvent.onUpdate(engine, addBall)

    return [
      walls,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'SuperSoakerRepeated',
  text: "<span>Make the ball touch the right wall</span>"
}

export default level