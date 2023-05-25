// Credit to https://github.com/shundroid/matter-lines/

import { Bodies, type Vector, Composite, type IBodyDefinition } from "matter-js";

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
  world: Matter.World
  body: Composite
  points: Vector[] = []
  lineWidth: number
  lastPoint: Vector | null = null
  bodyOpts: IBodyDefinition = {
    render: {
      lineWidth: 0,
      fillStyle: "#FF0000",
    },
    isStatic: true
  }
  constructor(world: Matter.World, lineWidth = 16) {
    this.world = world
    this.lineWidth = lineWidth
    this.body = Composite.create()
    Composite.add(this.world, this.body)
    // const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
  }
  addPoint(point: Vector) {
    this.points.push({
      x: point.x,
      y: point.y
    })
    Composite.add(this.body,
      Bodies.circle(point.x, point.y, this.lineWidth / 2, this.bodyOpts)
    )
    if (this.lastPoint) {
      Composite.add(this.body, Bodies.rectangle(
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

    // TODO: update bounds
    // const bounds = Bounds.create(vertices);
    // Body.setPosition(this.body, {
    //   x: this.body.position.x - this.body.bounds.min.x + bounds.min.x,
    //   y: this.body.position.y - this.body.bounds.min.y + bounds.min.y
    // });
    // Body.setStatic(this.body, true);
  }
}