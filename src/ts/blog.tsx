import diyStoriesThumb from "@/assets/DiyStoriesThumb.png"
import algsThumb from "@/assets/AlgsThumb.png"
import type { PreviewCard } from "@/@types"

export const blogPosts: PreviewCard[] = [
  {
    path: 'diy-stories',
    title: 'Do It Yourself: Stories',
    subtitle: 'Implement component stories from scratch',
    thumb: diyStoriesThumb,
  },
  {
    path: 'algs-in-three-levels',
    title: 'Algorithms in Three Levels',
    subtitle: 'Python, Algorithms & Data Structures',
    thumb: algsThumb,
  },
  {
    path: 'if-vs-ternary',
    title: 'Does identical logic produce the same instructions?',
    subtitle: 'Assembly, C++',
  },
]