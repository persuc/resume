// Credit to https://github.com/shundroid/matter-lines/

import { Bodies, Vector, Composite, type IBodyDefinition, Body, Events, Detector, Collision } from "matter-js";

export function distance(p1: Vector, p2: Vector) {
  const a = Math.abs(p1.x - p2.x)
  const b = Math.abs(p1.y - p2.y)
  return Math.sqrt(a * a + b * b);
}

function getAngleRad(p1: Vector, p2: Vector){
  // returns the angle between 2 points in radians
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export default class Line {
  engine: Matter.Engine
  body: Body
  parts: Body[] = []
  partsSet: Set<Body> = new Set()
  points: Vector[] = []
  lineWidth: number
  halfLineWidth: number
  lastPoint: Vector | null = null
  bodyOpts: IBodyDefinition = {
    render: {
      lineWidth: 0,
      fillStyle: "#FF0000",
    },
  }
  constructor(engine: Matter.Engine, lineWidth = 16) {
    this.engine = engine
    this.lineWidth = lineWidth
    this.halfLineWidth = lineWidth / 2
    this.body = Body.create({
      isStatic: true
    })
    this.resetParts()
    Composite.add(this.engine.world, this.body)
    // const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
  }
  addPoint(point: Vector) {
    const circle = Bodies.circle(point.x, point.y, this.halfLineWidth, this.bodyOpts)
    const rect = this.lastPoint ? Bodies.rectangle(
        (point.x + this.lastPoint.x) / 2,
        (point.y + this.lastPoint.y) / 2,
        distance(point, this.lastPoint),
        this.lineWidth,
        {
          ...this.bodyOpts,
          angle: getAngleRad(point, this.lastPoint)
        }
      ) : null
    if (this.wouldCollide(circle, rect)) {
      return
    }
    this.points.push({
      x: point.x,
      y: point.y
    })

    this.parts.push(circle)
    this.partsSet.add(circle)
    if (rect) {
      this.parts.push(rect)
      this.partsSet.add(rect)
    }
    this.lastPoint = this.points[this.points.length - 1]

    this.resetParts()
  }

  resetParts() {
    // Body.setParts messes with transformation.rotation
    // If this.body is translated/rotated, parts are set with values that are relative.
    // see https://github.com/liabru/matter-js/issues/1050

    Body.setParts(this.body, [])
    Body.setAngle(this.body, 0)
    Body.setPosition(this.body, Vector.create(0, 0))
    Body.setParts(this.body, this.parts);
  }

  getAllBodies(): Body[] {
    const bodies: Body[] = []

    for (const body of Composite.allBodies(this.engine.world)) {
      if (body.parts.length > 1) {
        for (let i = 1; i < body.parts.length; i++) {
          if (body.parts[i] === this.body || this.parts.includes(body.parts[i])) {
            continue
          }
          bodies.push(body.parts[i])
        }
      } else {
        if (body === this.body || this.partsSet.has(body)) {
          continue
        }
        bodies.push(body)
      }
    }

    return bodies
  }

  wouldCollide(circle: Body, rect: Body | null) {
    const bodies = this.getAllBodies().concat(circle).concat(rect === null ? [] : [rect])

    const detector = Detector.create({
      bodies
    })

    const collisions = Detector.collisions(detector)

    function filter(collision: Collision) {
      return (collision.bodyA === circle ||
        collision.bodyA === rect ||
        collision.bodyB === circle ||
        collision.bodyB === rect) && !(
          [circle, rect].includes(collision.bodyA) && [circle, rect].includes(collision.bodyB)
        )
    }

    return collisions.some(filter)
  }
}