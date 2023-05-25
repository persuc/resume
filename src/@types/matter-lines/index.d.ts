declare module 'matter-lines' {
  const Matter = import("matter-js")
  export default class Line {
    constructor(world: Matter.World, points: Matter.IMousePoint[])
    clear(): void
    addPoint(point: Matter.IMousePoint): void
    getVertices(): Matter.IMousePoint[]
  }
}