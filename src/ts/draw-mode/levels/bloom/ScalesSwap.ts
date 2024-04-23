import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Composite, Constraint, Engine, Vertices } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import { distance } from "@/ts/draw-mode/Util"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const floor = BodyUtil.wallFloor()

    const ball = Bodies.circle(150, 350, 20)

    const lever = Bodies.rectangle(400, 280, 500, 10, {
      collisionFilter: {
        group: -1
      }
    })
    const base = BodyUtil.isosceles(400, 480, 100, 300, {
      collisionFilter: {
        group: -1
      }
    })
    const pinJoint = Constraint.create({
      bodyA: base,
      bodyB: lever,
      pointA: {
        x: 0,
        y: -200
      },
      length: 0,
      stiffness: 0.9,
    })

    const leftBasket = Bodies.fromVertices(150, 380, [
      BodyUtil.vectorCup(
        160,
        40,
        20
      ),
    ])

    const leftRopeLeft = Constraint.create({
      bodyA: lever,
      pointA: { x: -250, y: 0 },
      bodyB: leftBasket,
      pointB: { x: -70, y: -20 },
    })

    const leftRopeRight = Constraint.create({
      bodyA: lever,
      pointA: { x: -250, y: 0 },
      bodyB: leftBasket,
      pointB: { x: 70, y: -20 },
    })

    const rightBasket = Bodies.fromVertices(650, 380, [
      BodyUtil.vectorCup(
        160,
        40,
        20
      ),
    ])

    const rightRopeLeft = Constraint.create({
      bodyA: lever,
      pointA: { x: 250, y: 0 },
      bodyB: rightBasket,
      pointB: { x: -70, y: -20 },
    })

    const rightRopeRight = Constraint.create({
      bodyA: lever,
      pointA: { x: 250, y: 0 },
      bodyB: rightBasket,
      pointB: { x: 70, y: -20 },
    })

    const scales = Composite.create({
      bodies: [
        lever,
        base,
        leftBasket,
        rightBasket,
      ],
      constraints: [
        pinJoint,
        leftRopeLeft,
        leftRopeRight,
        rightRopeLeft,
        rightRopeRight
      ]
    })

    const target = {
      body: Bodies.rectangle(650, 250, 40, 40, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE
    }

    EndCondition.onCondition(engine, () => {
      return distance(ball.position, target.body.position) < 40
    }, onEnd)

    return [
      { body: ball, color: Color.TARGET },
      floor,
      target,
      { body: scales }
    ]
  },
  id: 'ScalesSwap',
  text: "<span>Make the ball hit the target.</span>"
}

export default level