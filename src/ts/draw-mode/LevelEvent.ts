import { removeInPlace } from "@/ts/utils"
import { Engine, Events, Body, Collision, Pairs, type IEventCollision } from "matter-js"

const eventsToRemove = [] as { eventType: string, handler: (e: any) => void, callback: () => any }[]

export function onUpdate(engine: Engine, callback: () => any) {
  const eventType = 'afterUpdate'
  Events.on(engine, eventType, callback)
  eventsToRemove.push({
    eventType,
    handler: callback,
    callback,
  })
}

export function onAnyCollision(engine: Engine, body: Body, callback: () => any) {
  const eventType = 'collisionStart'
  function handler(event: IEventCollision<Body>) {
    if (event.pairs.some(p => p.bodyA === body || p.bodyB === body)) {
      callback()
      Events.off(engine, eventType, handler)
    }
  }
  Events.on(engine, eventType, handler)
  eventsToRemove.push({
    eventType,
    handler,
    callback,
  })
}

export function onCollision(engine: Engine, bodyA: Body, bodyB: Body, callback: () => any) {
  return onCondition(engine, () => Collision.collides(bodyA, bodyB, undefined as unknown as Pairs) !== null, callback)
}

export function onNoCollision(engine: Engine, bodyA: Body, bodyB: Body, callback: () => any) {
  return onCondition(engine, () => Collision.collides(bodyA, bodyB, undefined as unknown as Pairs) === null, callback)
}

export function onCondition(engine: Engine, condition: () => boolean, callback: () => any) {
  const eventType = 'afterUpdate'
  function handler() {
    if (condition()) {
      callback()
      Events.off(engine, eventType, handler)
    }
  }
  Events.on(engine, eventType, handler)
  eventsToRemove.push({
    eventType,
    handler,
    callback,
  })
}

export function onCollisionDuration(engine: Engine, bodyA: Body, bodyB: Body, millis: number, callback: () => any) {
  const eventType = 'afterUpdate'
  let timeOfFirstCollision = -1
  function handler() {
    if (Collision.collides(bodyA, bodyB, undefined as unknown as Pairs)) {
      if (timeOfFirstCollision < 0) {
        timeOfFirstCollision = performance.now()
      } else if (performance.now() - timeOfFirstCollision > millis) {
        callback()
        Events.off(engine, eventType, handler)
      }
    } else {
      timeOfFirstCollision = -1
    }
  }
  Events.on(engine, eventType, handler)
  eventsToRemove.push({
    eventType,
    handler,
    callback,
  })
}

export function onCollisionAndCondition(engine: Engine, bodyA: Body, bodyB: Body, condition: () => boolean, callback: () => any) {
  const eventType = 'afterUpdate'
  function handler() {
    if (condition() && Collision.collides(bodyA, bodyB, undefined as unknown as Pairs)) {
      callback()
      Events.off(engine, eventType, handler)
    }
  }
  Events.on(engine, eventType, handler)
  eventsToRemove.push({
    eventType,
    handler,
    callback,
  })
}

export function removeEvents(engine: Engine, callback: () => void) {
  for (const e of eventsToRemove) {
    if (e.callback == callback) {
      Events.off(engine, e.eventType, e.handler)
    }
  }
  removeInPlace(eventsToRemove, e => e.callback === callback)
}

export function cleanUpLevelEvents(engine: Engine) {

  // Note: Engine.events is an array, with the properties 'afterUpdate', 'beforeUpdate' etc.
  // This is bizarre, but it's how matter.js works, so we can see what events exist like:
  // console.log('events:', (engine as any).events.afterUpdate)

  let e = eventsToRemove.pop()
  while (e) {
    Events.off(engine, e.eventType, e.handler)
    e = eventsToRemove.pop()
  }
}