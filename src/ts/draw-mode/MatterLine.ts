import { Bodies, Vector, Composite, type IBodyDefinition, Body, Events, Detector, Collision } from "matter-js";

function distance(p1: Vector, p2: Vector) {
  const a = Math.abs(p1.x - p2.x)
  const b = Math.abs(p1.y - p2.y)
  return Math.sqrt(a * a + b * b);
}

function getAngleRad(p1: Vector, p2: Vector){
  // returns the angle between 2 points in radians
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

const MINIMUM_DRAW_DISTANCE = 6

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
    collisionFilter: {
      category: 2,
      mask: 3,
    },
  }
  constructor(engine: Matter.Engine, lineWidth = 16) {
    this.engine = engine
    this.lineWidth = lineWidth
    this.halfLineWidth = lineWidth / 2
    this.body = Body.create({
      isStatic: true,
      collisionFilter: {
        category: 2,
        mask: 3,
      },
      render: {
        visible: false
      },
      label: 'lineContainer',
    })
    this.resetParts()
    Composite.add(this.engine.world, this.body)
  }
  addPoint(point: Vector) {
    const distanceToLast = this.lastPoint ? distance(this.lastPoint, point) : Infinity

    if (distanceToLast < MINIMUM_DRAW_DISTANCE) {
      return
    }

    const circle = Bodies.circle(point.x, point.y, this.halfLineWidth, {
      ...this.bodyOpts,
      label: 'drawnPoint_' + this.points.length + 1
    })
    const rect = this.lastPoint ? Bodies.rectangle(
        (point.x + this.lastPoint.x) / 2,
        (point.y + this.lastPoint.y) / 2,
        distanceToLast,
        this.lineWidth,
        {
          ...this.bodyOpts,
          collisionFilter: {
            category: 2,
            mask: 3,
          },
          angle: getAngleRad(point, this.lastPoint),
          label: 'drawnRect_' + this.points.length + 1
        }
      ) : null
    const collisions = this.wouldCollide(circle, rect)

    if (collisions.length) {
      if (!this.lastPoint) {
        return
      }

      let d = distance(this.lastPoint, point)
      for (const previous of this.points) {
        const dd = distance(previous, point)
        if (dd < d) {
          d = dd
          this.lastPoint = previous
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
        return
      }

      // TODO: think about collisions with "rect" later
      const collision = collisions.find(c => c.bodyA === circle || c.bodyB === circle)

      if (!collision) {
        return
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
          const d = distance(p, newPoint)
          if (d < result.distanceToClosest) {
            return {
              closestPoint: p,
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
        return
      }

      const newCircle = Bodies.circle(newPoint.x, newPoint.y, this.halfLineWidth, {
        ...this.bodyOpts,
        label: 'drawnPoint_' + this.points.length + 1
      })
      const newRect = Bodies.rectangle(
        (newPoint.x + closestPoint.x) / 2,
        (newPoint.y + closestPoint.y) / 2,
        distanceToClosest,
        this.lineWidth,
        {
          ...this.bodyOpts,
          collisionFilter: {
            category: 2,
            mask: 3,
          },
          label: 'drawnRect_' + this.points.length + 1,
          angle: getAngleRad(newPoint, closestPoint)
        }
      )

      const collisionsTwo = this.wouldCollide(newCircle, newRect)

      if (collisionsTwo.length) {
        return 
      }

      this.points.push(newPoint)
      this.parts.push(newCircle)
      this.partsSet.add(newCircle)
      this.parts.push(newRect)
      this.partsSet.add(newRect)
      this.onPointAdded()
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
    this.onPointAdded()
    
  }

  onPointAdded() {
    this.resetParts()
    this.lastPoint = this.points[this.points.length - 1]
    this.body.render.visible = true
  }

  end() {
    Body.setStatic(this.body, false)
    for (const body of this.body.parts) {
      body.collisionFilter.mask = -1
      body.collisionFilter.category = 1
    }
    Body.setMass(this.body, Math.max(1.6, this.points.length / 3))
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

  wouldCollide(circle: Body, rect: Body | null): Collision[] {
    const bodies = this.getAllBodies().concat(circle)
    
    if (rect) {
      bodies.push(rect)
    }

    const detector = Detector.create({
      bodies
    })

    const collisions = Detector.collisions(detector).filter((collision: Collision) => {
      const pair: (Body | null)[] = [collision.bodyA, collision.bodyB]
      return pair.includes(rect) !== pair.includes(circle)
    })
    
    return collisions
  }
}