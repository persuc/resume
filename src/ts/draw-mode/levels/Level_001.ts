import { wallCup, type LevelSpec } from "@/ts/draw-mode/Level"
import { Color } from "@/ts/draw-mode/Theme"
import { Bodies } from "matter-js"

const level: LevelSpec = {
  generateBodies() {
    return [
      Bodies.rectangle(400, 540, 80, 80, {
        isStatic: true
      }),
      { body: Bodies.circle(400, 515, 40), color: Color.TARGET }
    ]
  },
  text: "Knock the ball off"
}

export default level