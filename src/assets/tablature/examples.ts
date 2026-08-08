import cry_wolf from './cry_wolf.json'
import witch_s_rune from './witch_s_rune.json'

export interface ExampleTab {
  slug: string
  title: string
  artist: string
  content: string
}

export const exampleTabs: ExampleTab[] = [
  { slug: 'cry-wolf', title: cry_wolf.title, artist: cry_wolf.artist, content: cry_wolf.content },
  {
    slug: 'witch-s-rune',
    title: witch_s_rune.title,
    artist: witch_s_rune.artist,
    content: witch_s_rune.content
  }
]

export function findExample(slug: string): ExampleTab | undefined {
  return exampleTabs.find((example) => example.slug === slug)
}
