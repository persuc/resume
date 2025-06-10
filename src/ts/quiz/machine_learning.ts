import type { QuizData } from "@/@types/quiz"

export default {
  name: 'Machine learning',
  questions: [
    {
      body: 'What does LAT stand for?',
      answers: [
        { answer: 'Loss/Accuracy Transpose' },
        { answer: 'Logistic Activation Tuning' },
        { answer: 'Linear Attention Transformer' },
        { answer: 'Latent Adversarial Training', correct: true },
      ],
    },
    {
      body: 'Which is a real field of mathematics',
      answers: [
        { answer: 'Dynamical mean field theory', correct: true },
        { answer: 'Dynamic mean field theory' },
        { answer: 'Diffuse mean field theory' },
        { answer: 'Diffused mean field theory' },
      ],
    },
    {
      body: 'Which is not a real ML paper?',
      answers: [
        { answer: 'Do Deep Nets Really Need to be Deep?' },
        { answer: 'Neural Networks are Expensive', correct: true },
        { answer: 'Man is to Computer Programmer as Woman is to Homemaker?' },
        { answer: 'Squeeze-and-Excitation Networks' },
      ],
    },
  ]
} satisfies QuizData