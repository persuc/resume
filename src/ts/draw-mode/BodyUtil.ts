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
      // Ensure vertices are provided in clockwise order when us
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
      body: Bodies.rectangle(400, 590, 762, 20, { isStatic: true }),
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
  isConstraint(object: Object): object is Constraint {
    return 'type' in object && object.type === 'constraint'
  },
  isBody(object: Object): object is Body {
    return 'type' in object && object.type === 'body'
  },
  isComposite(object: Object): object is Composite {
    return 'type' in object && object.type === 'composite'
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