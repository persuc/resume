import type { QuizData } from "@/@types/quiz"

export default {
  name: 'Computer Science II',
  questions: [
    {
      body: 'What is computer architecture taxonomy is most recent?',
      answers: [
        { answer: 'Duncan\'s taxonomy accounting for pipelined vector processes', correct: true },
        { answer: 'Feng\'s taxonomy based whether bit and word level operations happen in serial or parallel' },
        { answer: 'Flynn\'s taxonomy based on control and data streams' },
        { answer: 'Wolfgang Handler\'s erlängen taxonomy based on the number of PCUs and ALUs that can be pipelined' },
      ],
    },
    {
      body: 'What does the term "Computer Science Ontology" mean?',
      answers: [
        { answer: 'An automatically generated taxonomy of computer science research topics', correct: true },
        { answer: 'A branch of metaethics also involved in other areas such as machine consciousness' },
        { answer: 'A taxonomy of computer science problems categorising problems such as the halting problem and busy beavers problem' },
        { answer: 'Another way of referring to the architecural taxonomies from Q1' },
      ],
    },
    {
      body: 'The CSO knowledge graph is available in many formats. Which is NOT a real language for representing knowledge graphs?',
      answers: [
        { answer: 'N-Triples' },
        { answer: 'OWL' },
        { answer: 'Turtle' },
        { answer: 'Vertex command', correct: true },
        { answer: 'All of the above except (1)' },
      ],
    },
    {
      body: 'Which material <i>cannot</i> be made into a semiconductor?',
      answers: [
        { answer: 'Pure elements' },
        { answer: 'Organic compounds' },
        { answer: 'Metals', correct: true },
        { answer: 'Metals + organic compounds' },
        { answer: 'Metalloids' },
        { answer: 'All of the above except (5)' },
      ]
    },
    {
      body: 'Which is not a property of semiconductors?',
      answers: [
        { answer: 'Excited electrons' },
        { answer: 'Form homojunctions' },
        { answer: 'Light emission' },
        { answer: 'Sound emission' },
        { answer: 'All of these are properties of semiconductors', correct: true },
      ]
    },
    {
      body: 'What is another name for semiconductor nanocrystals?',
      answers: [
        { answer: 'Mini ploons', },
        { answer: 'Nanodiodes' },
        { answer: 'Photoluminant particle boxes' },
        { answer: 'Quantum dots', correct: true },
      ]
    },
    {
      body: 'Which statement describes homojunction?',
      answers: [
        { answer: 'It is the exchange of electrons and holes between the differently doped semiconducting materials' },
        { answer: 'It causes the migrating electrons from the n-type to come in contact with the migrating holes from the p-type' },
        { answer: 'It produces a narrow strip of immobile ions, which causes an electric field' },
        { answer: 'It can occur between either doped or non-doped semiconducting materials', revealedAnswer: 'Only doped semiconductors (those with added impurities) can undergo homojunction' },
        { answer: 'All of the above except for (4)', correct: true },
      ]
    },
    {
      body: 'Which is a real type of automata?',
      answers: [
        { answer: 'Follow' },
        { answer: 'Good-for-Games' },
        { answer: 'Non deterministic XOR' },
        { answer: 'Visibly pushdown' },
        { answer: 'All of the above', correct: true },
      ]
    },
    {
      body: 'Which statement about Good-for-Games automata is false?',
      subtitleBody: 'An automaton recognizing language L is good for games (GFG) if its composition with any game with winning condition L preserves the game\'s winner.',
      answers: [
        { answer: 'Some deterministic automata are GFG' },
        { answer: 'All deterministic automata are GFG' },
        { answer: 'Some nondeterministic automata are GFG' },
        { answer: 'All nondeterministic automata are GFG', correct: true },
        { answer: 'Determinizing Büchi and co-Büchi alternating GFG automata involves a 2<sup>Θ(n)</sup> state blow-up' },
        { answer: 'All of the above' },
      ]
    },
    {
      body: 'What is "wear leveling"?',
      answers: [
        { answer: 'A cache replacement policy a binary tree of one-bit pointers which point to a less-recently-used sub-tree', revealedAnswer: '(This is actually Pseudo-LRU)' },
        { answer: 'The effect of keycaps becoming rounded after repeated use' },
        { answer: 'A programming paradigm aiming to increase uniformity in the number of writes in storage media', correct: true },
        { answer: 'An online algorithm used for constructing tree datastructures for efficient read access with known input patterns' },
      ]
    },
    {
      body: 'Which is not a real alogrithm/data structure used in caching?',
      answers: [
        { answer: 'Priority-queue-based survival-queue', revealedAnswer: '(Used in Pannier policies)' },
        { answer: 'Set dueling', revealedAnswer: '(Used in Dynamic Re-Reference Interval Prediction policies' },
        { answer: 'Dynamic aging', revealedAnswer: '(A variation on LFU policies)' },
        { answer: 'Privileged partitions', revealedAnswer: '(Used in Least Frequent Recently Used policies)' },
        { answer: 'Probationary segments', revealedAnswer: '(Used in Segmented LRU policies)' },
        { answer: 'Protected segments', revealedAnswer: '(Used in Segmented LRU policies)' },
        { answer: 'All of the above are real', correct: true },
      ]
    },
    {
      body: ['Name a type of fragmentation other than external fragmentation'],
      subtitleBody: '(External fragmentation arises when free memory is separated into small blocks and is interspersed by allocated memory.)',
      answersCanBeSubstrings: true,
      nearMisses: {
        'internal': 'Nice try, describe it',
      },
      answers: [
        // internal fragmentation due to unused page space
        'paging',
        'page',
        'slack',
        'chunk',
        // data fragmentation
        'data',
        'file system',
        'file-system',
        'filesystem',
      ]
    }
  ],
} satisfies QuizData