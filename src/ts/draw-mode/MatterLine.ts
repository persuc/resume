import { DEFAULT_FRICTION, DEFAULT_FRICTION_AIR, DEFAULT_FRICTION_STATIC, DEFAULT_SLOP, MINIMUM_DRAW_DISTANCE } from "@/ts/draw-mode/Config"
import type { Replay } from "@/ts/draw-mode/Replay"
import { distance, getAngleRad } from "@/ts/draw-mode/Util"
import { Bodies, Vector, Composite, type IBodyDefinition, Body, Events, Detector, Collision, Bounds } from "matter-js"

export default class Line {
  engine: Matter.Engine
  body: Body
  parts: Body[] = []
  partsSet: Set<Body> = new Set()
  points: {
    position: Vector,
    from: Vector | null,
    time: number
  }[] = []
  lineWidth: number
  halfLineWidth: number
  lastPoint: Vector | null = null
  bodyOpts: IBodyDefinition = {
    render: {
      lineWidth: 0,
      fillStyle: "#FF0000",
    },
    collisionFilter: {
      category: 2,
      mask: 3,
    },
    friction: DEFAULT_FRICTION,
    frictionAir: DEFAULT_FRICTION_AIR,
    frictionStatic: DEFAULT_FRICTION_STATIC,
    slop: DEFAULT_SLOP
  }
  overdrawnPoints = 0
  circleCollisionPoints: Vector[]

  constructor(engine: Matter.Engine, lineWidth = 16) {
    this.engine = engine
    this.lineWidth = lineWidth
    this.halfLineWidth = lineWidth / 2
    this.body = Body.create({
      isStatic: true,
      collisionFilter: {
        category: 2,
        mask: 0,
      },
      render: {
        visible: false
      },
      label: 'lineContainer',
    })
    this.circleCollisionPoints = [
      Vector.create(0, 0),
      Vector.create(this.halfLineWidth, 0),
      Vector.create(-this.halfLineWidth, 0),
      Vector.create(0, this.halfLineWidth),
      Vector.create(0, -this.halfLineWidth),
    ]
    this.resetParts()
    Composite.add(this.engine.world, this.body)
  }

  generatePointBodies(point: Vector, from: Vector | null) {
    const distanceToLast = from ? distance(point, from) : Infinity
    return {
      circle: Bodies.circle(point.x, point.y, this.halfLineWidth, {
        ...this.bodyOpts,
        label: 'drawnPoint_' + this.points.length + 1
      }),
      rect: from ? Bodies.rectangle(
        (point.x + from.x) / 2,
        (point.y + from.y) / 2,
        distanceToLast,
        this.lineWidth,
        {
          ...this.bodyOpts,
          collisionFilter: {
            category: 2,
            mask: 3,
          },
          angle: getAngleRad(point, from),
          label: 'drawnRect_' + this.points.length + 1
        }
      ) : null,
      distanceToLast
    }
  }

  addPoint(point: Vector): boolean {
    const { circle, rect, distanceToLast } = this.generatePointBodies(point, this.lastPoint)

    if (distanceToLast < MINIMUM_DRAW_DISTANCE) {
      return false
    }

    if (this.isOverdrawing(circle)) {
      this.lastPoint = circle.position
      this.overdrawnPoints++
      return true
    }

    const collisions = this.wouldCollide(circle, rect)

    if (collisions.length) {
      if (!this.lastPoint) {
        return false
      }

      let smallestDistance = distanceToLast
      for (const previous of this.points) {
        const distanceToPrevious = distance(previous.position, point)
        if (distanceToPrevious < smallestDistance) {
          smallestDistance = distanceToPrevious
          this.lastPoint = previous.position
        }
      }

      const lineBits = [circle, rect]
      const otherCollidedObjects = collisions.reduce(
        (acc, c) => {
          if (!lineBits.includes(c.bodyA)) {
            acc.add(c.bodyA)
          }
          if (!lineBits.includes(c.bodyB)) {
            acc.add(c.bodyB)
          }
          return acc
        }, new Set<Body>()
      )
      if (otherCollidedObjects.size > 1) {
        return false
      }

      // TODO: think about collisions with "rect" later
      const collision = collisions.find(c => c.bodyA === circle || c.bodyB === circle)

      if (!collision) {
        return false
      }

      const newPoint: Vector = {
        x: circle.position.x - collision.penetration.x + -collision.normal.x,
        y: circle.position.y - collision.penetration.y + -collision.normal.y
      }

      const {
        closestPoint,
        distanceToClosest
      } = this.points.reduce(
        (result, p) => {
          const d = distance(p.position, newPoint)
          if (d < result.distanceToClosest) {
            return {
              closestPoint: p.position,
              distanceToClosest: d,
            }
          }
          return result
        },
        {
          closestPoint: this.lastPoint,
          distanceToClosest: Infinity,
        }
      )

      if (distanceToClosest < MINIMUM_DRAW_DISTANCE) {
        return false
      }

      const newBodies = this.generatePointBodies(newPoint, closestPoint)
      const newCircle = newBodies.circle

      const newRect = newBodies.rect

      const collisionsTwo = this.wouldCollide(newCircle, newRect)

      if (collisionsTwo.length) {
        return false
      }

      this.addPointBodies(newPoint, closestPoint, newCircle, newRect)
    } else {
      this.addPointBodies(point, this.lastPoint, circle, rect)
    }
    this.resetParts()
    return true
  }

  addPointsWithoutChecks(points: { position: Vector, from: Vector | null }[]) {
    for (const p of points) {
      const { circle, rect } = this.generatePointBodies(p.position, p.from)
      this.addPointBodies(p.position, p.from, circle, rect)
    }
    if (points.length)
      this.resetParts()
  }

  addPointBodies(point: Vector, from: Vector | null, circle: Body, rect: Body | null) {
    this.points.push({
      position: {
        x: point.x,
        y: point.y
      },
      from: from ? {
        x: from.x,
        y: from.y,
      } : null,
      time: this.engine.timing.timestamp
    })

    this.parts.push(circle)
    this.partsSet.add(circle)
    if (rect) {
      this.parts.push(rect)
      this.partsSet.add(rect)
    }
    this.lastPoint = this.points[this.points.length - 1].position
    this.body.render.visible = true
    this.body.collisionFilter.mask = -1
  }

  calculateMass() {
    return Math.max(1.6, (this.points.length + this.overdrawnPoints) / 3)
  }

  end() {
    Body.setStatic(this.body, false)
    if (this.body.parts.length > 1) {
      for (const body of this.body.parts) {
        body.collisionFilter.mask = -1
        body.collisionFilter.category = 1
      }
    }
    Body.setMass(this.body, this.calculateMass())

    return this.points
  }

  resetParts() {
    // Body.setParts messes with transformation.rotation
    // If this.body is translated/rotated, parts are set with values that are relative.
    // see https://github.com/liabru/matter-js/issues/1050

    Body.setParts(this.body, [])
    Body.setAngle(this.body, 0)
    Body.setPosition(this.body, Vector.create(0, 0))
    Body.setParts(this.body, this.parts)
  }

  setColor(color: string) {
    this.bodyOpts.render!.fillStyle = color
    for (const part of this.parts) {
      part.render.fillStyle = color
    }
  }

  getAllBodies(): Body[] {
    const bodies: Body[] = []

    for (const body of Composite.allBodies(this.engine.world)) {
      if (body.parts.length > 1) {
        for (let i = 1; i < body.parts.length; i++) {
          if (body.parts[i] === this.body || this.partsSet.has(body.parts[i])) {
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

  isOverdrawing(circle: Body) {
    // TODO: implement
    // for (const point of this.circleCollisionPoints) {
    //   if (!this.parts.some(p => Bounds.contains(p.bounds, Vector.add(circle.position, point)))) {
    //     return false
    //   }
    // }
    // for (const cp of this.circleCollisionPoints) {
    //   const point = Vector.add(circle.position, cp)
    //   for (const part of this.parts) {
    //     if (part.type)
    //   }
    //   if (!this.parts.some(p => Bounds.contains(p.bounds, ))) {
    //     return false
    //   }
    // }
    return false
    return true
  }

  wouldCollide(circle: Body, rect: Body | null): Collision[] {
    const bodies = this.getAllBodies().concat(circle)

    if (rect) {
      bodies.push(rect)
    }

    // TODO: only create the detector once, and update it with new bodies via an onBodyAdded() handler
    const detector = Detector.create({
      bodies
    })

    const collisions = Detector.collisions(detector).filter((collision: Collision) => {
      const pair: (Body | null)[] = [collision.bodyA, collision.bodyB]
      return pair.includes(rect) !== pair.includes(circle)
    })

    Detector.clear(detector)

    return collisions
  }
}