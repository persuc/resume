// Credit to https://github.com/shundroid/matter-lines/

import { Bodies, Vector, Composite, type IBodyDefinition, Body, Events } from "matter-js";

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
  points: Vector[] = []
  lineWidth: number
  lastPoint: Vector | null = null
  bodyOpts: IBodyDefinition = {
    render: {
      lineWidth: 0,
      fillStyle: "#FF0000",
    },
  }
  integer: number = 0
  constructor(engine: Matter.Engine, lineWidth = 16) {
    this.engine = engine
    this.lineWidth = lineWidth
    this.body = Body.create({
      isStatic: true
    })
    this.resetParts()
    Composite.add(this.engine.world, this.body)
    // const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
  }
  addPoint(point: Vector) {
    this.points.push({
      x: point.x,
      y: point.y
    })
    this.parts.push(Bodies.circle(point.x, point.y, this.lineWidth / 2, this.bodyOpts))
    if (this.lastPoint) {
      this.parts.push(Bodies.rectangle(
        (point.x + this.lastPoint.x) / 2,
        (point.y + this.lastPoint.y) / 2,
        distance(point, this.lastPoint),
        this.lineWidth,
        {
          ...this.bodyOpts,
          angle: getAngleRad(point, this.lastPoint)
        }
      ))
    }
    this.lastPoint = this.points[this.points.length - 1]

    this.resetParts()

    // TODO: update bounds
    // const bounds = Bounds.create(vertices);
    // Body.setPosition(this.body, {
    //   x: this.body.position.x - this.body.bounds.min.x + bounds.min.x,
    //   y: this.body.position.y - this.body.bounds.min.y + bounds.min.y
    // });
    // Body.setStatic(this.body, true);
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
}