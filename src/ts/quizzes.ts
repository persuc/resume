import type { QuizQuestion } from "@/@types/quiz"

export default [
  {
    name: 'Computer Science',
    questions: [
      {
        body: 'What is Jensen\'s device?',
        answers: [
          { answer: 'A cutlery holder designed by Danish silversmith, <b>Georg Jensen</b>' },
          { answer: 'A <b>call by name</b> argument evaluation technique', correct: true },
          { answer: 'A CPU that implements the <b>very long instruction word</b> (VLIW) architecture' },
          { answer: 'A bridge between computer memory and IO devices to enable port-mapped IO' },
        ],
      },
      {
        body: 'Which one is not a supported OpenAI model?',
        answers: [
          { answer: "code-search-ada-code-001" },
          { answer: "babbage-code-search-code" },
          { answer: "text-search-davinci-text-001", correct: true },
          { answer: "text-search-davinci-query-001" },
        ],
      },
      {
        body: 'Which one is not a supported OpenAI model?',
        answers: [
          { answer: "babbage" },
          { answer: "babbage-001", correct: true },
          { answer: "text-babbage-001" },
          { answer: "babbage-002" },
        ],
      },
      {
        body: 'What is a phantom?',
        answers: [
          { answer: 'A brand-model of the Nvidia GeForce RTX™ 3080', correct: true },
          { answer: 'A type of inconsistency during concurrent database transactions', correct: true },
          { answer: 'A packet that has been erroneously retransmitted after being received' },
          { answer: 'All of the above' },
        ]
      },
      {
        body: 'Which of these is not a real NPM package?',
        answers: [
          { answer: 'is-ten-thousand (returns whether a number is ten thousand)' },
          { answer: 'none (does nothing)'},
          { answer: 'if (executes a handler if a condition is true)' },
          { answer: 'is-april (returns true if the system month is April) ', correct: true },
        ]
      },
      {
        body: 'Which of these is not a real data structure?',
        answers: [
          { answer: 'Finger Tree' },
          { answer: 'Treap' },
          { answer: 'Fenwick Tree' },
          { answer: 'Knuth Tree', correct: true },
        ]
      },
      {
        body: 'Which of these is not a real data structure?',
        answers: [
          { answer: 'Quotient Filter' },
          { answer: 'Bloom Filter' },
          { answer: 'Cuckoo Filter' },
          { answer: 'Open-Interval Filter', correct: true },
        ]
      },
    ],
  },
  // {
  //   name: 'Two',
  //   questions: [
  //     {
  //       body: '',
  //       answers: [
  //         { answer: '' },
  //       ],
  //     },
  //   ]
  // },
] satisfies { name: string, questions: QuizQuestion[] }[]
