type BaseQuestion<T> = {
  body: string | string[],
  subtitleBody?: string,
  revealedBody?: string,
  answers: T[],
  image?: string,
}

export type MultiChoiceQuestion = BaseQuestion<{ answer: string, correct?: boolean, revealedAnswer?: string, image?: string }>

/**
 * @param nearMisses: mapping of near miss answer to text displayed when this input is received
 * @param answersCanBeSubstrings: if true, guesses that contain any answer as a substring will be accepted
 */
export type TextQuestion = BaseQuestion<string> & {
  hints?: string[],
  nearMisses?: Record<string, string>,
  answersCanBeSubstrings?: boolean
}


export type MatchupQuestion = BaseQuestion<[string, string]> & {
  retries: number
}

export type QuizQuestion = MultiChoiceQuestion | TextQuestion | MatchupQuestion

export type QuizData = {
  name: string,
  questions: QuizQuestion[]
}

export function isTextQuestion(q: BaseQuestion<unknown>): q is TextQuestion {
  return q.answers.every(answer => typeof answer === 'string')
}

export function isMultiChoiceQuestion(q: BaseQuestion<unknown>): q is MultiChoiceQuestion {
  return q.answers.every(answer => {
    return typeof answer === 'object' && answer !== null && 'answer' in answer
  })
}

export function isMatchupQuestion(q: BaseQuestion<unknown>): q is MatchupQuestion {
  return q.answers.every(answer => {
    return Array.isArray(answer) && answer.length == 2 && answer.every(a => typeof (a) === 'string')
  })
}

export function getQuizId(q: QuizData): string {
  return q.name.toLowerCase().replaceAll(/[&\/?%]/g, '').replaceAll(/\s+/g, '-')
}