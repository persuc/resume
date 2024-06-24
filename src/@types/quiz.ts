type BaseQuestion = {
  body: string | string[],
  answers: unknown,
}

export type MultiChoiceQuestion = BaseQuestion & {
  answers: { answer: string, correct?: boolean }[],
}

export type TextQuestion = BaseQuestion & {
  answers: string[],
  hints?: string[],
  nearMisses?: Record<string, string>,
}

export type QuizQuestion = MultiChoiceQuestion | TextQuestion

export function isTextQuestion(q: BaseQuestion): q is TextQuestion {
  return Array.isArray(q.answers) && q.answers.every(answer => typeof answer === 'string')
}

export function isMultiChoiceQuestion(q: BaseQuestion): q is MultiChoiceQuestion {
  return Array.isArray(q.answers) && q.answers.every(answer => {
    return typeof answer === 'object' && answer !== null && 'answer' in answer
  })
}