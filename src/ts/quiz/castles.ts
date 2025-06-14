import type { QuizData } from "@/@types/quiz"
import buttress from "@/assets/architecture-quiz/001.webp"
import bailey from "@/assets/architecture-quiz/002.jpg"
import arrowslit from "@/assets/architecture-quiz/003.jpg"

// https://en.wikipedia.org/wiki/Architecture_of_cathedrals_and_great_churches
// https://great-castles.com/glossary.html
// http://www.castles-of-britain.com/medievaljobs.htm

export default {
  name: 'Castles',
  questions: [
    {
      body: "What would you call this?",
      image: buttress,
      answers: [
        { answer: 'Boiserie' },
        { answer: 'Bolster' },
        { answer: 'Bracing spar' },
        { answer: 'Buttress', correct: true },
      ],
    },
    {
      body: "But what type of buttress <i>specifically</i>?",
      image: buttress,
      answers: [
        { answer: 'Angled buttress' },
        { answer: 'Diagonal/french buttress' },
        { answer: 'Flying buttress', correct: true },
        { answer: 'Setback buttress', },
      ],
    },
    {
      body: "What do you call the open, grassy area within the outer wall?",
      image: bailey,
      answers: [
        { answer: 'Bailey', correct: true },
        { answer: 'Courtyard' },
        { answer: 'Inner-palisade' },
        { answer: 'Shell-keep' },
      ],
    },
    {
      body: "What is <i>not</i> a correct name for the vertical holes in the outer wall?",
      image: arrowslit,
      answers: [
        { answer: 'Arrow slit' },
        { answer: 'Arrow loop' },
        { answer: 'Creux', correct: true },
        { answer: 'Rayere' },
      ],
    },
    {
      body: "What is <i>not</i> a real part of a castle?",
      answers: [
        { answer: 'Buick', correct: true },
        { answer: 'Corbel', revealedAnswer: 'Corbel (A projection from a wall which supports a beam or similar structure)', },
        { answer: 'Machicolation', revealedAnswer: 'Machicolation (Battlement brought forward on corbels to allow material to be dropped through gaps)', },
        { answer: 'Sally-port', revealedAnswer: 'Sally-port (Side gate for defenders to go out on an attack)', },
        { answer: 'None of the above' },
      ],
    },
    {
      body: "What is <i>not</i> a real part of a castle?",
      answers: [
        { answer: 'Barmkin', revealedAnswer: 'Barmkin (A courtyard surrounding a tower house, defended by a perimeter wall)', },
        { answer: 'Butter-barrel tower', revealedAnswer: 'Butter-barrel tower (A two-part defensive tower in which the upper part of the tower has a smaller diameter than the lower tower structure)', },
        { answer: 'Donjon', revealedAnswer: 'Donjon (Great tower or keep)', },
        { answer: 'Quoin', revealedAnswer: 'Quoin (Dressed cornerstone at the corner of a building)', },
        { answer: 'None of the above', correct: true, },
      ],
    },
    {
      body: "What is <i>not</i> a real device used in seiges?",
      answers: [
        { answer: 'Bombard', revealedAnswer: 'Bombard (Early form of cannon)', },
        { answer: 'Petrary', revealedAnswer: 'Petrary (Stone throwing engine)', },
        { answer: 'Mangonel', revealedAnswer: 'Mangonel (Catapult, sometimes referred to as a traction trebuchet or a torsion engine)', },
        { answer: 'Mantlet', revealedAnswer: 'Mantlet (Mobile wooden protective shield on wheels)', },
        { answer: 'Manipult', correct: true },
        { answer: 'Springald', revealedAnswer: 'Springald (Device for projecting large bolts or stones)', },
        { answer: 'Oh please these are just nonsense words', },
      ],
    },
    {
      body: "Who ranks the highest?",
      answers: [
        { answer: 'Gong farmer', revealedAnswer: 'Gong farmer (Lowest. A latrine pit emptier)', },
        { answer: 'Cottar', revealedAnswer: 'Cottar (Second lowest. Swine-herds and prison guards)', },
        { answer: 'Scullion', revealedAnswer: 'Scullion (Third lowest. Cleans the kitchen)', },
        { answer: 'Chambermaid', revealedAnswer: 'Chambermaid (Fourth lowest. Tidies, tends fires, empties chamberpots)', },
        { answer: 'Reeve', correct: true, revealedAnswer: "Reeve (Highest. Supervises the work on lord's property)", },
      ],
    },
  ]
} satisfies QuizData