// Credit to https://github.com/shundroid/matter-lines/

import { Bodies, World, Body, Vertices, Bounds, type Vector, Common, Composite } from "matter-js";

class LineInternal {
  points: Vector[]
  outsidePoints: Vector[]
  insidePoints: Vector[]
  lineWidth: number
  miterLimit: number
  constructor(defaultPoints: Vector[] = [], lineWidth = 10, miterLimit = 10) {
    this.points = defaultPoints;
    this.outsidePoints = [];
    this.insidePoints = [];
    this.lineWidth = lineWidth;
    this.miterLimit = miterLimit;

    if (this.points.length > 0) {
      this.calculatePoints();
    }
  }
  clear() {
    this.points = [];
    this.outsidePoints = [];
    this.insidePoints = [];
  }
  addPoint(point: Vector) {
    this.points.push({
      x: point.x,
      y: point.y
    });
    console.log('points', this.points)
    this.calculatePoints();
  }
  calculatePoints() {
    this.outsidePoints = [];
    this.insidePoints = [];
    if (this.points.length <= 1) return;
    for (let index = 0; index < this.points.length; index++) {
      if (index === 0) {
        this.calculateFirstPoint(index);
      } else if (index === this.points.length - 1) {
        this.calculateLastPoint(index);
      } else {
        this.calculateMiddlePoint(index);
      }
    }
  }
  calculateFirstPoint(index: number) {
    const point = this.points[index];
    const afterPoint = this.points[index + 1];
    const rad =
      Math.atan2(afterPoint.y - point.y, afterPoint.x - point.x) - Math.PI / 2;
    const sin = Math.sin(rad) * this.lineWidth;
    const cos = Math.cos(rad) * this.lineWidth;
    this.outsidePoints.push({ x: point.x + cos, y: point.y + sin });
    this.insidePoints.push({ x: point.x - cos, y: point.y - sin });
  }
  calculateLastPoint(index: number) {
    const point = this.points[index];
    const beforePoint = this.points[index];
    const rad =
      Math.atan2(this.points[index - 1].y - point.y, this.points[index - 1].x - point.x) + Math.PI / 2;
    const sin = Math.sin(rad) * this.lineWidth;
    const cos = Math.cos(rad) * this.lineWidth;
    this.outsidePoints.push({ x: point.x + cos, y: point.y + sin });
    this.insidePoints.push({ x: point.x - cos, y: point.y - sin });
  }
  calculateMiddlePoint(index: number) {
    const point = this.points[index];
    let rad1 = Math.atan2(this.points[index - 1].y - point.y, this.points[index - 1].x - point.x);
    let rad2 = Math.atan2(this.points[index + 1].y - point.y, this.points[index + 1].x - point.x);
    // rad1 = 0° にした、二等分線になっている
    const rad = (rad2 - rad1) / 2;
    const x = Math.cos(rad) * this.lineWidth / Math.sin(rad);
    const y = this.lineWidth;
    const distance = getDistance({ x: 0, y: 0 }, { x, y });
    // 回転移動させる
    const rx = x * Math.cos(rad1) - y * Math.sin(rad1);
    const ry = x * Math.sin(rad1) + y * Math.cos(rad1);
    rad1 -= Math.PI / 2;
    rad2 += Math.PI / 2;
    if (distance > this.miterLimit && x < 0) {
      this.outsidePoints.push({ x: point.x - Math.cos(rad1) * this.lineWidth, y: point.y - Math.sin(rad1) * this.lineWidth });
      this.outsidePoints.push({ x: point.x - Math.cos(rad2) * this.lineWidth, y: point.y - Math.sin(rad2) * this.lineWidth });
    } else {
      this.outsidePoints.push({ x: point.x + rx, y: point.y + ry });
    }
    if (distance > this.miterLimit && x >= 0) {
      this.insidePoints.push({ x: point.x + Math.cos(rad1) * this.lineWidth, y: point.y + Math.sin(rad1) * this.lineWidth });
      this.insidePoints.push({ x: point.x + Math.cos(rad2) * this.lineWidth, y: point.y + Math.sin(rad2) * this.lineWidth });
    } else {
      this.insidePoints.push({ x: point.x - rx, y: point.y - ry });
    }
  }
  getVertices(): Vector[] {
    return this.outsidePoints.concat([...this.insidePoints].reverse()).filter(v => [v.x, v.y].every(u => !Number.isNaN(u) && Number.isFinite(u)));
  }
}

function getDistance(point1: Vector, point2: Vector) {
  // 三平方の定理
  const a = Math.abs(point1.x - point2.x);
  const b = Math.abs(point1.y - point2.y);
  return Math.sqrt(a * a + b * b);
}

export default class Line extends LineInternal {
  world: Matter.World
  body: Matter.Body | null
  constructor(world: Matter.World, defaultPoints: Vector[] = [], lineWidth = 10, miterLimit = 10) {
    super(defaultPoints, lineWidth, miterLimit);
    this.world = world;
    this.body = null;
    this.generateBody();
  }
  addPoint(point: Vector) {
    super.addPoint(point);
    this.generateBody();
  }
  generateBody() {
    const vertices = this.getVertices();
    if (vertices.length <= 4) {
      if (this.body !== null) {
        Composite.remove(this.world, this.body)
      }
      if (vertices.length > 0) {
        this.body = Bodies.circle(vertices[0].x, vertices[0].y, this.lineWidth / 2);
        Composite.add(this.world, this.body)
      } else {
        this.body = null;
      }
    } else {
      if (this.body !== null) {
        World.remove(this.world, this.body);
      }
      const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
      this.body = Bodies.fromVertices(0, 0, [vertices], {
        render: {
            strokeStyle: '#fff',
            lineWidth: 1,
            fillStyle: color
        }
      }, true, undefined, 0, undefined);
      Composite.add(this.world, this.body)
      const bounds = Bounds.create(vertices);
      Body.setPosition(this.body, {
        x: this.body.position.x - this.body.bounds.min.x + bounds.min.x,
        y: this.body.position.y - this.body.bounds.min.y + bounds.min.y
      });
      Body.setStatic(this.body, true);
    }
  }
}