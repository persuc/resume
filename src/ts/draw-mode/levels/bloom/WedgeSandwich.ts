import type { LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Engine, Events, Vector } from "matter-js"
import * as EndCondition from "@/ts/draw-mode/EndCondition"
import BodyUtil from "@/ts/draw-mode/BodyUtil"

const level: LevelSpec = {
  generateBodies(engine: Engine, onEnd: () => any) {

    const floor = BodyUtil.wallFloor()

    const WEDGE_WIDTH = 400
    const WEDGE_HEIGHT = 150
    const WEDGE_X = 400
    const WEDGE_Y = 533
    const WEDGE_GRADIENT = WEDGE_HEIGHT / WEDGE_WIDTH
    const WEDGE_SLOT_START = 120
    const WEDGE_SLOT_END = 200

    const wedge = Bodies.fromVertices(WEDGE_X, WEDGE_Y, [
      [
        {
          x: -WEDGE_WIDTH / 2,
          y: 0,
        },
        {
          x: -WEDGE_WIDTH / 2,
          y: -WEDGE_HEIGHT,
        },
        {
          x: -WEDGE_WIDTH / 2 + WEDGE_SLOT_START,
          y: WEDGE_GRADIENT * WEDGE_SLOT_START - WEDGE_HEIGHT,
        },
        {
          x: -WEDGE_WIDTH / 2 + WEDGE_SLOT_START,
          y: -50,
        },
        {
          x: -WEDGE_WIDTH / 2 + WEDGE_SLOT_END,
          y: -50,
        },
        {
          x: 0,
          y: WEDGE_GRADIENT * WEDGE_SLOT_END - WEDGE_HEIGHT,
        },
        {
          x: WEDGE_WIDTH / 2,
          y: 0,
        },
      ]
    ], {
      render: {
        strokeStyle: 'none'
      }
    })

    const ball = Bodies.circle(410, 510, 20)

    const wedgeCap = Bodies.fromVertices(WEDGE_X - 60, WEDGE_Y - 100, [
      [
        {
          x: -WEDGE_WIDTH / 2 - 1,
          y: -1,
        },
        {
          x: -WEDGE_WIDTH / 2 - 41,
          y: -1,
        },
        {
          x: -WEDGE_WIDTH / 2 - 41,
          y: -WEDGE_HEIGHT - 1 - 55,
        },
        {
          x: WEDGE_WIDTH / 2 + 90,
          y: -1,
        },
        {
          x: WEDGE_WIDTH / 2 - 1,
          y: -1,
        },
        {
          x: -WEDGE_WIDTH / 2 - 1,
          y: -WEDGE_HEIGHT - 1,
        },
      ]
    ])
    
    const slotCollision = Bodies.rectangle(0, 0, 100, 60, {
      collisionFilter: {
        mask: 0
      },
      isStatic: true,
      angle: WEDGE_GRADIENT,
      render: {
        visible: false
      }
    })

    Events.on(engine, 'afterUpdate', () => {
      Body.setPosition(slotCollision, Vector.add(wedge.position, { x: 19, y: -14 }))
    })
    
    EndCondition.onNoCollision(engine, ball, slotCollision, onEnd)

    return [
      { body: ball, color: Color.TARGET },
      // slotCollision,
      floor,
      wedge,
      wedgeCap,
    ]
  },
  id: 'WedgeSandwich',
  text: "<p>Take the ball out.</p>"
}

export default level