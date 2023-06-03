import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Composite, Engine } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const leftWall = Bodies.rectangle(10, 320, 20, 560)
    const rightWall = Bodies.rectangle(790, 320, 20, 560)

    const wallBody = Body.create({
      isStatic: true,
      parts: [
        leftWall,
        rightWall,
      ],
    })
    const walls = {
      body: wallBody,
      color: Color.WALL,
    }
    const target = Bodies.circle(400, 300, 40, {
      isSleeping: true
    })

    const noDraw = {
      body: Bodies.rectangle(400, 300, 800, 600, {
        isStatic: true,
        collisionFilter: {
          category: 2,
          mask: 0,
        },
        render: {
          visible: false
        }
      }),
      color: Color.NO_DRAW,
      opacity: 0.2
    }
    
    EndCondition.onAnyCollision(engine, target, () => {
      target.isSleeping = false
      noDraw.body.collisionFilter.mask = 2
      noDraw.body.render.visible = true
      setTimeout(() => {
        if (target.position.y < 610 && Composite.allBodies(engine.world).includes(target)) {
          onEnd()
        }
      }, 3000)
    })

    return [
      walls,
      noDraw,
      { body: target, color: Color.TARGET }
    ]
  },
  id: 'NoDrawAfterAwaken',
  text: "<p>After this ball awakens, you cannot draw.</p><p>Awaken the ball, but don't let it fall.</p>"
}

export default level