import { Engine, Events, Body, type IEventCollision } from "matter-js"

export function onCollision(engine: Engine, body1: Body, body2: Body, onEnd: () => any) {
  function callback(event: IEventCollision<Body>) {
    if (event.pairs.some(p => {
      const bodies = [p.bodyA, p.bodyB]
      return bodies.includes(body1) && bodies.includes(body2)
    })) {
      onEnd()
      Events.off(engine, 'collisionStart', callback)
    }
  }
  Events.on(engine, 'collisionStart', callback)
}

export function onPredicate(engine: Engine, body: Body, predicate: (body: Body) => boolean, onEnd: () => any) {
  function callback() {
    if (predicate(body)) {
      onEnd()
      Events.off(engine, 'afterUpdate', callback)
    }
  }
  Events.on(engine, 'afterUpdate', callback)
}