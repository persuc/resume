import type { QuizData } from "@/@types/quiz"
import castles from "@/ts/quiz/castles"
import charlie_sheen from "@/ts/quiz/charlie_sheen"
import coastal_structures from "@/ts/quiz/coastal_structures"
import comp_sci from "@/ts/quiz/comp_sci"
import machine_learning from "@/ts/quiz/machine_learning"
import vape_flavours from "@/ts/quiz/vape_flavours"

export default [
  comp_sci,
  machine_learning,
  vape_flavours,
  charlie_sheen,
  coastal_structures,
  castles,
] satisfies QuizData[]
