import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies, Body, Constraint, Engine, Events, Vector } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { Color } from "@/ts/draw-mode/Theme"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const ball = Bodies.circle(100, 410, 20)

    const cannon = BodyUtil.bodyCup(100, 300, 80, 200, 20)

    Body.setAngle(cannon, 0.7)

    const pinJoint = Constraint.create({
      pointA: { x: 55, y: 460 },
      bodyB: cannon,
      pointB: { x: -46, y: 55 },
      length: 0,
      stiffness: 0.9,
    })

    Vector.mult(Vector.normalise(Vector.sub(ball.position, pinJoint.pointA)), 0.1)

    EndCondition.onCollisionDuration(engine, cannon, ball, 2000, () => Body.applyForce(ball, pinJoint.pointA, Vector.mult(Vector.normalise(Vector.sub(ball.position, pinJoint.pointA)), 0.1)))
    
    const target = {
      body: Bodies.rectangle(600, 500, 40, 40, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: 0.6
    }

    EndCondition.onCollision(engine, ball, target.body, onEnd)

    return [
      cannon,
      pinJoint,
      target,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'CannonHinged',
  text: "<span>Hit the target.</span>"
}

export default level