import type { Vector } from "matter-js"

export function squareDistance(p1: Vector, p2: Vector) {
  const a = Math.abs(p1.x - p2.x)
  const b = Math.abs(p1.y - p2.y)
  return a * a + b * b
}

export function distance(p1: Vector, p2: Vector) {
  const a = Math.abs(p1.x - p2.x)
  const b = Math.abs(p1.y - p2.y)
  return Math.sqrt(a * a + b * b)
}

export function getAngleRad(p1: Vector, p2: Vector) {
  // returns the angle between 2 points in radians
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

export function degreesToRadians(degrees: number) {
  return degrees * Math.PI / 180
}

export function isPointInRect(p: Vector, a: Vector, b: Vector, c: Vector, d: Vector, rectArea: number) {
  const sum = triangleArea(a, p, d) + triangleArea(d, p, c) + triangleArea(c, p, b) + triangleArea(p, b, a)
  return sum <= rectArea // in or on edge of rect
}

export function triangleArea(a: Vector, b: Vector, c: Vector) {
  return Math.abs((b.x * a.y - a.x * b.y) + (c.x * b.y - b.x * c.y) + (a.x * c.y - c.x * a.y)) / 2
}