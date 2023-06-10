import type { Level, LevelSpec } from "@/ts/draw-mode/Level"
import type { Vector } from "matter-js"
import type { Ref } from "vue"

export type SerialisedReplay = {
  lineHistory: Replay['lineHistory']
  specId: string
}

export interface Replay {
  lineHistory: {
    position: Vector,
    from: Vector | null,
    time: number
  }[][],
  spec: LevelSpec
}

let lineIdx = 0
let pointIdx = 0
let lineHistory: Replay['lineHistory'] = []
let spec: LevelSpec | null = null
let level: Ref<Level | null> | null = null

function start(replay: Replay, levelRef: Ref<Level | null>) {
  level = levelRef
  spec = replay.spec
  lineHistory = replay.lineHistory
  lineIdx = 0
  pointIdx = 0
}

export const ReplayPlayer: {
  start(replay: Replay, level: Ref<Level | null>): void
  restart(): void
  render(): void
  stop(): void
  getReplay(): Replay | null
} = {
  start,
  restart() {
    if (spec && level) {
      start({
        lineHistory: lineHistory,
        spec: spec,
      }, level)
    }
  },
  render() {
    if (!spec || !level?.value) {
      return
    }
    const time = performance.now()
    let pointsToAdd = []

    while (lineIdx < lineHistory.length && time >= lineHistory[lineIdx][pointIdx].time + level.value.startTime) {
      const point = lineHistory[lineIdx][pointIdx]
      if (pointIdx === 0) {
        level.value.startLine()
      }
      pointsToAdd.push(point)
      if (pointIdx < lineHistory[lineIdx].length - 1) {
        pointIdx++
      } else {
        level.value.line!.addPointsWithoutChecks(pointsToAdd)
        pointsToAdd = []
        level.value.endLine()
        lineIdx++
        pointIdx = 0
      }
    }
    level.value.line!.addPointsWithoutChecks(pointsToAdd)
    pointsToAdd = []
  },
  stop() {
    lineIdx = lineHistory.length
  },
  getReplay() {
    return spec ? {
      lineHistory,
      spec
    } : null
  }
}