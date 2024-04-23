import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies, Body, Constraint, Engine, Events } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"
import { NO_DRAW_AREA_OPACITY } from "@/ts/draw-mode/Config"
import { Color } from "@/ts/draw-mode/Theme"
import { type Level } from "@/ts/draw-mode/Level"

const level: LevelSpec = {
  generateBodies(engine: Engine, level: Level, onEnd: () => any) {

    const walls = BodyUtil.wallCup()

    const ball = Bodies.circle(60, 35, 20, {
      isSleeping: true
    })

    const ramp = BodyUtil.rightAngle(120, 100, 300, 50, 'NE', {
      isStatic: true
    })

    const leftBlock = Bodies.rectangle(200, 380, 200, 400)
    const rightBlock = Bodies.rectangle(600, 380, 200, 400)

    function jostleCliffs() {
      Body.applyForce(leftBlock, { x: 50, y: 200 }, { x: 0.5, y: 0 })
      Body.applyForce(rightBlock, { x: 750, y: 200 }, { x: -0.5, y: 0 })
      Events.off(engine, 'afterUpdate', jostleCliffs)
    }

    Events.on(engine, 'afterUpdate', jostleCliffs)
    level.cleanupHandlers.push(() => Events.off(engine, 'afterUpdate', jostleCliffs))

    const leftPinJoint = Constraint.create({
      pointA: { x: 300, y: 580 },
      bodyB: leftBlock,
      pointB: { x: 100, y: 200 },
      length: 0,
      stiffness: 0.9,
    })

    const rightPinJoint = Constraint.create({
      pointA: { x: 500, y: 580 },
      bodyB: rightBlock,
      pointB: { x: -100, y: 200 },
      length: 0,
      stiffness: 0.9,
    })

    const noDraw = {
      body: Bodies.rectangle(400, 290, 599, 580, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 2,
        }
      }),
      color: Color.NO_DRAW,
      opacity: NO_DRAW_AREA_OPACITY
    }

    const target = {
      body: Bodies.rectangle(400, 170, 40, 40, {
        isStatic: true,
        collisionFilter: {
          mask: 0,
        }
      }),
      color: Color.ZONE,
      opacity: 0.6
    }

    EndCondition.onAnyCollision(engine, ball, () => {
      ball.isSleeping = false
    })

    EndCondition.onCollisionDuration(engine, ball, target.body, 3000, onEnd)

    return [
      walls,
      ramp,
      leftBlock,
      rightBlock,
      leftPinJoint,
      rightPinJoint,
      target,
      noDraw,
      { body: ball, color: Color.TARGET }
    ]
  },
  id: 'SuspendBetweenCliffs',
  text: "<span>Keep the ball in the target zone for 3 seconds.</span>"
}

export default level