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
    if (!spec || !level?.value || level.value.spec.id !== spec.id) {
      return
    }

    while (lineIdx < lineHistory.length && performance.now() >= lineHistory[lineIdx][pointIdx].time + level.value.startTime) {
      const point = lineHistory[lineIdx][pointIdx]
      if (pointIdx === 0) {
        level.value.startLine(point.position)
      } else {
        level.value.line!.addPointWithoutChecks(point.position, point.from)
      }
      if (pointIdx < lineHistory[lineIdx].length - 1) {
        pointIdx++
      } else {
        level.value.endLine()
        lineIdx++
        pointIdx = 0
      }
    }
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