import type { ColouredBody } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies, Body, Composite, Constraint, Vector, type IBodyDefinition } from "matter-js"

export default {
  /**
   * 
   * @param x x-coordinate of the middle of the base of the triangle
   * @param y y-coordinate of the base of the triangle
   * @param width width of the base of the triangle
   * @param height height of the triangle
   * @returns 
   */
  isosceles(x: number, y: number, width: number, height: number, options?: IBodyDefinition): Body {
    return Bodies.fromVertices(x, y, [
      // Ensure vertices are provided in clockwise order when using Bodies.fromVertices
      // See https://brm.io/matter-js/docs/classes/Bodies.html#method_fromVertices
      [
        {
          x: x,
          y: y - height,
        },
        {
          x: x + width / 2,
          y: y,
        },
        {
          x: x - width / 2,
          y: y,
        },
      ]
    ], options)
  },
  /**
   * 
   * @param width length of the triangle's horizontal edge
   * @param height length of the triangle's vertical edge
   * @param orientation Cardinal direction of the slanted edge of the triangle
   */
  rightAngle(x: number, y: number, width: number, height: number, orientation: 'NE' | 'NW' | 'SE' | 'SW', options?: IBodyDefinition): Body {
    const ySign = {
      NE: -1,
      NW: -1,
      SE: 1,
      SW: 1
    }[orientation]

    const xSign = {
      NE: 0,
      NW: 1,
      SE: 0,
      SW: 1
    }[orientation]

    const zeroVert = {
      x: 0,
      y: 0,
    }

    const widthVert = {
      x: width,
      y: 0,
    }

    const angleVert = {
      x: xSign * width,
      y: ySign * height,
    }

    const verts = ySign > 0 ? [
      zeroVert, angleVert, widthVert
    ] : [
      zeroVert, widthVert, angleVert
    ]

    return Bodies.fromVertices(x, y, [
      verts
    ], options)
  },
  /**
   * @param x x-coordinate of the top left corner of the rectangle
   * @param y y-coordinate of the top left corner of the rectangle
   * @param width width of the rectangle
   * @param height height of the rectangle
   * @returns 
   */
  rectangleTopLeftCoords(x: number, y: number, width: number, height: number, options?: IBodyDefinition): Body {
    return Bodies.rectangle(x + width / 2, y + height / 2, width, height, options)
  },
  wallFloor(): ColouredBody {
    return {
      body: Bodies.rectangle(400, 590, 800, 20, { isStatic: true }),
      color: Color.WALL,
    }
  },
  wallCup(): ColouredBody & {
    floor: Body,
    left: Body,
    right: Body
  } {

    const floor = Bodies.rectangle(400, 590, 762, 20)
    const left = Bodies.rectangle(10, 300, 20, 600)
    const right = Bodies.rectangle(790, 300, 20, 600)

    const body = Body.create({
      isStatic: true,
      parts: [
        floor,
        left,
        right
      ],
    })
    return {
      body,
      color: Color.WALL,
      floor,
      left,
      right,
    }
  },
  wallSides(): ColouredBody & {
    left: Body,
    right: Body
  } {

    const left = Bodies.rectangle(10, 300, 20, 600)
    const right = Bodies.rectangle(790, 300, 20, 600)

    const body = Body.create({
      isStatic: true,
      parts: [
        left,
        right
      ],
    })
    return {
      body,
      color: Color.WALL,
      left,
      right,
    }
  },
  wallBox(): ColouredBody & {
    floor: Body,
    left: Body,
    right: Body,
    top: Body
  } {

    const floor = Bodies.rectangle(400, 590, 762, 20)
    const left = Bodies.rectangle(10, 300, 20, 600)
    const right = Bodies.rectangle(790, 300, 20, 600)
    const top = Bodies.rectangle(400, 10, 762, 20)

    const body = Body.create({
      isStatic: true,
      parts: [
        floor,
        left,
        right,
        top
      ],
    })
    return {
      body,
      color: Color.WALL,
      floor,
      left,
      right,
      top,
    }
  },
  isConstraint(object: any): object is Constraint {
    return 'type' in object && object.type === 'constraint'
  },
  isBody(object: any): object is Body {
    return 'type' in object && object.type === 'body'
  },
  isComposite(object: any): object is Composite {
    return 'type' in object && object.type === 'composite'
  },
  bodyCup(x: number, y: number, width: number, height: number, thickness = 20, options?: IBodyDefinition) {
    const halfWidth = width / 2
    const halfHeight = height / 2
    const halfThickness = thickness / 2
    return Body.create({
      ...options,
      parts: [
        Bodies.rectangle(x + -halfWidth + halfThickness, y + halfHeight, thickness, height), // left
        Bodies.rectangle(x + halfWidth - halfThickness, y + halfHeight, thickness, height), // right
        Bodies.rectangle(x, y + height - halfThickness, width - 2 * thickness, thickness), // bottom
        ...(options?.parts ?? []),
      ]
    },)
  },
  vectorCup(width: number, height: number, thickness: number): Vector[] {
    const halfWidth = width / 2

    return [
      { x: -halfWidth, y: 0 },
      { x: -halfWidth, y: - height },
      { x: -halfWidth + thickness, y: - height },
      { x: -halfWidth + thickness, y: - thickness },
      { x: halfWidth - thickness, y: - thickness },
      { x: halfWidth - thickness, y: - height },
      { x: halfWidth, y: - height },
      { x: halfWidth, y: 0 },
    ]
  }
}