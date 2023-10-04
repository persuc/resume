import solitaireThumb from '@/assets/SolitaireThumb.png'
import drawThumb from '@/assets/DrawThumb.png'
import quizThumb from '@/assets/QuizThumb.png'
import type { PreviewCard } from '@/@types'

export const games: PreviewCard[] = [
  {
    path: '/missing-word',
    title: 'Missing Word',
    previewComponent: () => (
      <div>The ________ of the wolf is the pack</div>
    ),
  },
  {
    path: '/word-pinpoint',
    title: 'Word Pinpoint',
    previewComponent: () => (
      <div>
        <div class="mx-auto flex flex-col">
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
    previewComponent: () => (
      <div>
        <div>
          <span class="bg-black">I can't stop</span><span> you </span>
          <span class="bg-black">going away, but there</span><span> are </span>
          <span class="bg-black">you able to say you</span><span> loved?</span>
        </div>
      </div>
    ),
  },
  {
    path: '/solitaire',
    title: 'Stone Solitaire',
    thumb: solitaireThumb,
  },
  {
    path: '/draw',
    title: 'Super Sicko Draw Mode',
    thumb: drawThumb,
  },
  {
    path: '/quiz',
    title: 'Quizzes',
    thumb: quizThumb,
  },
]