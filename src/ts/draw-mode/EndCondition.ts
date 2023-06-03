import { Engine, Events, Body, Collision, Pairs, type IEventCollision } from "matter-js"

const eventsToRemove = [] as { eventType: string, callback: (e: any) => void }[]

export function onAnyCollision(engine: Engine, body: Body, onEnd: () => any) {
  const eventType = 'collisionStart'
  function callback(event: IEventCollision<Body>) {
    if (event.pairs.some(p => p.bodyA === body || p.bodyB === body)) {
      onEnd()
      Events.off(engine, eventType, callback)
    }
  }
  Events.on(engine, eventType, callback)
  eventsToRemove.push({
    eventType,
    callback
  })
}

export function onCollision(engine: Engine, bodyA: Body, bodyB: Body, onEnd: () => any) {
  const eventType = 'afterUpdate'
  function callback() {
    if (Collision.collides(bodyA, bodyB, undefined as unknown as Pairs)) {
      onEnd()
      Events.off(engine, eventType, callback)
    }
  }
  Events.on(engine, eventType, callback)
  eventsToRemove.push({
    eventType,
    callback
  })
}

export function onCondition(engine: Engine, condition: () => boolean, onEnd: () => any) {
  const eventType = 'afterUpdate'
  function callback() {
    if (condition()) {
      onEnd()
      Events.off(engine, eventType, callback)
    }
  }
  Events.on(engine, eventType, callback)
  eventsToRemove.push({
    eventType,
    callback
  })
}

export function cleanupEndConditions(engine: Engine) {

  // Note: Engine.events is an array, with the properties 'afterUpdate', 'beforeUpdate' etc.
  // This is bizarre, but its how matter.js works, so we can see what events exist like:
  // console.log('events:', (engine as any).events.afterUpdate)

  let e = eventsToRemove.pop() 
  while (e) {
    Events.off(engine, e.eventType, e.callback)
    e = eventsToRemove.pop()
  }
}