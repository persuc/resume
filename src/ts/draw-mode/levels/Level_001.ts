import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Bodies } from "matter-js"

const level: LevelSpec = {
  createBodies() {
    return [
      wallCup(),
      // Two boxes
      Bodies.rectangle(400, 200, 80, 80),
    ]
  }
}

export default level