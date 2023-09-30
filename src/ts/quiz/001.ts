import type { QuizQuestionData } from "@/@types/quiz"

export default [
  {
    body: 'What is Jensen\'s device?',
    answers: [
      'A <b>call by name</b> argument evaluation technique',
      'A cutlery holder designed by Danish silversmith, <b>Georg Jensen</b>',
      'A CPU that implements the <b>very long instruction word</b> (VLIW) architecture',
      'A bridge between computer memory and IO devices to enable port-mapped IO',
    ],
  }
] satisfies QuizQuestionData[]