import solitaireThumb from '@/assets/SolitaireThumb.png'
import drawThumb from '@/assets/DrawThumb.png'
import quizThumb from '@/assets/QuizThumb.png'
import riddlesThumb from '@/assets/sphinx.jpg'
import type { PreviewCard } from '@/@types'

export const games: (PreviewCard & { component: string })[] = [
  {
    path: '/missing-word',
    title: 'Missing Word',
    component: 'MissingWord',
    previewComponent: () => <div class='overflow-hidden'>The ________ of the wolf is the pack</div>,
  },
  {
    path: '/word-pinpoint',
    title: 'Word Pinpoint',
    component: 'WordPinpoint',
    previewComponent: () => (
      <div class='overflow-hidden'>
        <div class='mx-auto flex flex-col'>
          <p>&gt; RAVAGE</p>
          <p>&gt; RAV___ ?</p>
          <p>&gt; RAVINE</p>
        </div>
      </div>
    ),
  },
  {
    path: '/blackout',
    title: 'Blackout Poem',
    component: 'BlackoutPoem',
    previewComponent: () => (
      <div class='max-h-full'>
        <div>
          <span class='bg-black'>I can't stop</span>
          <span> you </span>
          <span class='bg-black'>going away, but there</span>
          <span> are </span>
          <span class='bg-black'>you able to say you</span>
          <span> loved?</span>
        </div>
      </div>
    ),
  },
  {
    path: '/solitaire',
    title: 'Stone Solitaire',
    component: 'Solitaire',
    thumb: solitaireThumb,
  },
  {
    path: '/draw',
    title: 'Super Sicko Draw Mode',
    component: 'DrawMode',
    thumb: drawThumb,
  },
  {
    path: '/quiz',
    title: 'Quizzes',
    component: 'Quiz',
    thumb: quizThumb,
  },
  {
    path: '/riddles',
    title: 'Riddles',
    component: 'Riddles',
    thumb: riddlesThumb,
  },
  // TODO: enable me once it's built
  // {
  //   path: '/pazaak',
  //   title: 'Pazaak',
  //   component: 'Pazaak',
  // },
]
