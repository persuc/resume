export type QuizQuestion = {
  body: string,
  answers: { answer: string, correct?: boolean }[],
}