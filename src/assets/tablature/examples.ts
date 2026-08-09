import cry_wolf from './cry_wolf.json'
import witch_s_rune from './witch_s_rune.json'

export interface ExampleTab {
  slug: string
  title: string
  artist: string
  content: string
  link?: string
}

interface ExampleFile {
  title: string
  artist: string
  content: string
  link?: string
}

function example(slug: string, file: ExampleFile): ExampleTab {
  return { slug, title: file.title, artist: file.artist, content: file.content, link: file.link }
}

export const exampleTabs: ExampleTab[] = [
  example('cry-wolf', cry_wolf),
  example('witch-s-rune', witch_s_rune)
]

export function findExample(slug: string): ExampleTab | undefined {
  return exampleTabs.find((example) => example.slug === slug)
}
