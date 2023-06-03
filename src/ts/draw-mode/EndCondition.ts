import { Engine, Events, Body, type IEventCollision, Collision, Pairs } from "matter-js"

export function onCollision(engine: Engine, bodyA: Body, bodyB: Body, onEnd: () => any) {
  function callback() {
    if (Collision.collides(bodyA, bodyB, undefined as unknown as Pairs)) {
      onEnd()
      Events.off(engine, 'afterUpdate', callback)
    }
  }
  Events.on(engine, 'collisionStart', callback)
}

export function onCondition(engine: Engine, condition: () => boolean, onEnd: () => any) {
  function callback() {
    if (condition()) {
      onEnd()
      Events.off(engine, 'afterUpdate', callback)
    }
  }
  Events.on(engine, 'afterUpdate', callback)
}