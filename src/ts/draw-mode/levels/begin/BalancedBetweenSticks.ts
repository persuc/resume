import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Constraint, Engine } from "matter-js"
import * as LevelEvent from "@/ts/draw-mode/LevelEvent"
import { distance } from "@/ts/draw-mode/Util"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const ball = Bodies.circle(400, 380, 20)

    const leftStick = Bodies.rectangle(250, 400, 300, 10)
    const rightStick = Bodies.rectangle(550, 400, 300, 10)

    const leftWeight = Bodies.rectangle(150, 380, 30, 30)
    const rightWeight = Bodies.rectangle(650, 380, 30, 30)

    const leftPinJoint = Constraint.create({
      pointA: { x: 250, y: 400 },
      bodyB: leftStick,
      length: 0,
      stiffness: 0.9,
    })

    const rightPinJoint = Constraint.create({
      pointA: { x: 550, y: 400 },
      bodyB: rightStick,
      length: 0,
      stiffness: 0.9,
    })

    const target = {
      body: Bodies.circle(400, 200, 20, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE
    }

    LevelEvent.onCondition(engine, () => {
      return distance(ball.position, target.body.position) < 40
    }, onEnd)

    return [
      { body: ball, color: Color.TARGET },
      leftStick,
      rightStick,
      leftWeight,
      rightWeight,
      leftPinJoint,
      rightPinJoint,
      target
    ]
  },
  id: 'BalancedBetweenSticks',
  text: "<span>Make the ball hit the target.</span>"
}

export default level