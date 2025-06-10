import type { QuizData } from "@/@types/quiz"

export default {
  name: 'Art descriptions',
  questions: [
    {
      body: 'What was the curator describing: The tonal gradations and the underlying modelling of form have been blurred to a virtually impenetrable blackness.',
      revealedBody: "(Raphael: Cartoon for 'Virgin and Child', 1509 - 1511)",
      answers: [
        { answer: 'Art', correct: true },
        { answer: 'Music' },
        { answer: 'Writing' },
        { answer: 'Other' },
      ],
    },
  ]
} satisfies QuizData