import diyStoriesThumb from "@/assets/DiyStoriesThumb.png"
import breakoutThumb from "@/assets/breakoutThumb.png"
import algsThumb from "@/assets/AlgsThumb.png"
import type { PreviewCard } from "@/@types"

export const blogPosts: (PreviewCard & { component: string })[] = [
  {
    path: 'ppo-ram',
    title: 'Training PPO agents on RAM observations',
    subtitle: 'Capstone project for ARENA 3.0',
    thumb: breakoutThumb,
    component: 'PPORAM',
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
    title: 'Does identical logic produce the same instructions?',
    subtitle: 'Assembly, C++',
    component: 'IfVsTernary',
  },
].map(post => ({
  ...post,
  path: '/blog/' + post.path
}))