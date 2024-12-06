import diyStoriesThumb from '@/assets/DiyStoriesThumb.png'
import breakoutThumb from '@/assets/breakoutThumb.png'
import styletts2Thumb from '@/assets/StyleTTS2Thumb.png'
import brewThumb from '@/assets/BrewThumb.png'
import algsThumb from '@/assets/AlgsThumb.png'
import type { PreviewCard } from '@/@types'

const isDevelopment = process.env.NODE_ENV === 'development'

type Post = PreviewCard & { component: string }

const postsInDevelopment: Post[] = [
  {
    path: 'perplexity-prediction',
    title: 'Perplexity prediction',
    subtitle: 'Improving computational efficiency for LLMs',
    thumb: breakoutThumb, // TODO
    component: 'PerplexityPrediction',
  },
]

const finishedPosts: Post[] = [
  {
    path: 'ppo-ram',
    title: 'Training PPO agents on RAM observations',
    subtitle: 'Capstone project for ARENA 3.0',
    thumb: breakoutThumb,
    component: 'PPORAM',
  },
  {
    path: 'brew',
    title: 'How to write a homebrew formula',
    subtitle: 'Quick read: dependencies, compilation',
    thumb: brewThumb,
    component: 'Brew',
  },
  {
    path: 'speech-synthesis',
    title: 'History of speech synthesis',
    subtitle: 'Exploration of the techniques used and tooling I made for speech synthesis',
    thumb: styletts2Thumb,
    component: 'SpeechSynthesis',
  },
  {
    path: 'diy-stories',
    title: 'Do It Yourself: Stories',
    subtitle: 'Implement component stories from scratch',
    thumb: diyStoriesThumb,
    component: 'DIYStories',
  },
  {
    path: 'algs-in-three-levels',
    title: 'Algorithms in three levels',
    subtitle: 'Python, Algorithms & Data Structures',
    thumb: algsThumb,
    component: 'AlgsInThreeLevels',
  },
  {
    path: 'if-vs-ternary',
    title: 'Same code, same instructions?',
    subtitle: 'Assembly, C++',
    component: 'IfVsTernary',
  },
]

export const blogPosts: Post[] = (isDevelopment ? postsInDevelopment : [])
  .concat(finishedPosts)
  .map(post => ({
    ...post,
    path: '/blog/' + post.path,
  }))
