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
          { answer: 'none (does nothing)' },
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
      {
        body: 'What are Cyclic Barrier, Phaser, and Exchanger all examples of?',
        answers: [
          { answer: 'Objects in the <i>Star Trek</i> universe' },
          { answer: 'Components of laser interferometers' },
          { answer: 'Machines for fabricating CPUs, alongside the Aligner and Dicing Machine' },
          { answer: 'Classes in the <i>java.util.concurrent</i> package', correct: true },
        ],
      },
      {
        body: 'What is the Dining Philosophers problem?',
        answers: [
          { answer: 'A thought experiment regarding concurrent synchronisation issues', correct: true },
          { answer: 'A metaphor for undecidability in computability theory' },
          { answer: 'A thought experiment regarding utilitarian morality' },
          { answer: 'Another name for Gödel\'s incompleteness theorems' },

        ]
      },
      {
        body: 'Which of these is not a real computer science concept?',
        answers: [
          { answer: 'Child stealing' },
          { answer: 'Non-volatile CPUs', correct: true },
          { answer: 'Master/slave control' },
          { answer: 'Hard, firm and soft real-time systems' },

        ]
      },
      {
        body: 'What is the "Eden space"?',
        answers: [
          { answer: 'A portion of the Root Zone Database reserved for top-level domains for charitable causes' },
          { answer: 'A block of storage which is never reclaimed due to swap space intefering with disk defragmentation' },
          { answer: 'An area of shared memory mapped with PROT_WRITE protection' },
          { answer: 'Where objects are created in a generational garbage collector', correct: true },

        ]
      },
      {
        body: 'What is "Happy Eyeballs"?',
        answers: [
          { answer: 'A network connection strategy', correct: true },
          { answer: 'Another name for Computer Vision Syndrome' },
          { answer: 'A distributed clock algorithm' },
          { answer: 'Another name for "Fast Fallback"', correct: true },
        ]
      },
      {
        body: 'Which of these is not a concurrency library for python?',
        answers: [
          { answer: 'curio', },
          { answer: 'twisted', correct: true },
          { answer: 'trio', },
          { answer: 'tornado', },
        ]
      },
      {
        body: 'What can be parsed by a recursive descent parser?',
        answers: [
          { answer: 'Regular grammars', correct: true },
          { answer: 'Left recursive strings', },
          { answer: 'Right recursive strings', correct: true },
          { answer: 'Context sensitive languages', },
        ]
      },
      {
        body: 'Which term does not appear in the Apple TrueType reference manual?',
        answers: [
          { answer: 'mirp' },
          { answer: 'Ploop value', },
          { answer: 'Twilight zone' },
          { answer: 'Freedom vector', },
          { answer: 'None of the above', correct: true },
        ]
      },
      // https://en.wikipedia.org/wiki/Semiconductor_device_fabrication
    ],
  },
  {
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
      // {
      //   body: '',
      //   answers: [
      //     { answer: '' },
      //     { answer: '' },
      //     { answer: '' },
      //     { answer: '', correct: true },
      //   ],
      // },
    ]
  },
  {
    name: 'Charlie Sheen or League of Legends Quote?',
    questions: [
      {
        body: 'Winning is like breathing.',
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Sion)', correct: true },
        ],
      },
      {
        body: "You make a choice to win and you win...",
        answers: [
          { answer: 'Charlie Sheen', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: "Everyone loses... well, almost everyone.",
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Sett)', correct: true },
        ],
      },
      {
        body: 'Only cowards fear death.',
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Sion)', correct: true },
        ],
      },
      {
        body: "I have defeated this earthworm with my words. Imagine what I would have done with my fire breathing fists.",
        answers: [
          { answer: 'Charlie Sheen', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: 'Your face will melt off and your children will weep over your exploded body.',
        answers: [
          { answer: 'Charlie Sheen', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: 'I am stronger than man, stronger than machine, I am an idea.',
        answers: [
          { answer: 'Charlie Sheen' },
          { revealedAnswer: 'LoL (Urgot)', answer: 'LoL', correct: true },
        ],
      },
      {
        body: "I have a different constitution, I have a different brain, I have a different heart. I got tiger blood, man. Dying's for fools, dying's for amateurs.",
        answers: [
          { answer: 'Charlie Sheen', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: "All men wanna be me, too bad they ain't me.",
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Sett)', correct: true },
        ],
      },
      {
        body: "Me, mad? Haha... quite likely.",
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Sett)', correct: true },
        ],
      },
      {
        body: "They call me mad. All artists are mad.",
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Jhin)', correct: true },
        ],
      },
      {
        body: "If I realize that I'm insane, then I'm okay with it. I'm not dangerous insane.",
        answers: [
          { answer: 'Charlie Sheen', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: "An icon doesn't have to explain himself.",
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Jhin)', correct: true },
        ],
      },
      {
        body: "They're going to fuel the battle cry of my deadly and dangerous and secret and silent soldiers. Because they're all around you.",
        answers: [
          { answer: 'Charlie Sheen', revealedAnswer: 'Charlie Sheen (Sorry, you thought you were just messing with one dude. Winning.)', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: "I have one speed, I have one gear: go!",
        answers: [
          { answer: 'Charlie Sheen', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: "My work asks questions, it never has answers.",
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Jhin)', correct: true },
        ],
      },
      {
        body: "We are high priests, Vatican assassin warlocks.",
        answers: [
          { answer: 'Charlie Sheen', correct: true },
          { answer: 'LoL' },
        ],
      },
      {
        body: "I ain't no 'half-breed'... I'm a full breed, and I'm the only one.",
        answers: [
          { answer: 'Charlie Sheen' },
          { answer: 'LoL', revealedAnswer: 'LoL (Sett)', correct: true },
        ],
      },
    ]
  },
] satisfies { name: string, questions: QuizQuestion[] }[]
