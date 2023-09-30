export type QuizQuestion = {
  body: string,
  answers: string[],
  correctIndices: number[]
}

export type QuizQuestionData = {
  body: string,
  answers: string[],
  correctIndices?: number[]
}