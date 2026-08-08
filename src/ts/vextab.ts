export const DEFAULT_TEMPO = 120
export const COMMENT_TOKEN = '//'
export const HIDDEN_REST = '#_#'

const REST_TOKEN = /#(?:_|-?\d+)?#/g

export interface VexNote {
  shouldIgnoreTicks(): boolean
  isRest(): boolean
  getTicks(): { value(): number }
  getPlayNote(): string[] | null
  getAbsoluteX(): number
  getStave(): VexStave | null
  getNoteHeadBeginX?(): number
  getNoteHeadEndX?(): number
  getAttribute?(name: string): unknown
}

export interface VexStave {
  getYForLine(line: number): number
  getNumLines?(): number
}

export interface PlayerData {
  voices: { getTickables(): VexNote[] }[][]
  scale: number
}

export interface VexArticulation {
  first_note?: VexNote
  last_note?: VexNote
  slide_direction?: number
  text?: string
}

export interface VexArtist {
  getPlayerData(): PlayerData
  customizations: Record<string, string | number>
  staves: {
    tab?: VexStave | null
    note?: VexStave | null
    tab_notes?: VexNote[]
    note_notes?: VexNote[]
    tab_voices?: VexNote[][]
    note_voices?: VexNote[][]
  }[]
  tab_articulations: VexArticulation[]
}

export interface PreparedSource {
  code: string
  hiddenRests: Set<number>
}

export function stripComments(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      const at = line.indexOf(COMMENT_TOKEN)
      return at === -1 ? line : line.slice(0, at)
    })
    .join('\n')
}

export function prepareSource(raw: string): PreparedSource {
  const hiddenRests = new Set<number>()
  let rest = 0

  const code = stripComments(raw)
    .split('\n')
    .map((line) => {
      if (!line.trimStart().startsWith('notes')) return line

      return line.replace(REST_TOKEN, (match) => {
        const index = rest++
        if (match !== HIDDEN_REST) return match

        hiddenRests.add(index)
        return '##'
      })
    })
    .join('\n')

  return { code, hiddenRests }
}

function hideNote(note: VexNote | undefined): void {
  const element = note?.getAttribute?.('el') as { style?: { display: string } } | undefined
  if (element?.style) element.style.display = 'none'
}

export function hideRests(artist: VexArtist, hidden: Set<number>): void {
  if (!hidden.size) return

  let index = 0

  for (const stave of artist.staves || []) {
    const scoreVoices = stave.note_voices?.length ? stave.note_voices : [stave.note_notes || []]
    const tabVoices = stave.tab_voices?.length ? stave.tab_voices : [stave.tab_notes || []]

    for (let v = 0; v < scoreVoices.length; v++) {
      const scoreNotes = scoreVoices[v] || []
      const tabNotes = tabVoices[v] || []

      for (let i = 0; i < scoreNotes.length; i++) {
        if (!scoreNotes[i].isRest()) continue

        if (hidden.has(index)) {
          hideNote(scoreNotes[i])
          hideNote(tabNotes[i])
        }
        index++
      }
    }
  }
}
