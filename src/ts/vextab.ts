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

export interface DivInstance {
  artist: VexArtist & { reset(): void; draw(renderer: unknown): void }
  parser: { reset(): void; parse(code: string): unknown; isValid(): boolean }
  renderer: unknown
  ctx: { clear(): void }
}

export type DivConstructor = new (element: HTMLElement) => DivInstance

declare global {
  interface Window {
    vextab?: { default: DivConstructor }
  }
}

let vexTabPromise: Promise<DivConstructor> | null = null

export function loadVexTab(): Promise<DivConstructor> {
  if (vexTabPromise) return vexTabPromise

  const pending = new Promise<DivConstructor>((resolve, reject) => {
    if (typeof window.vextab?.default === 'function') {
      resolve(window.vextab.default)
      return
    }

    const script = document.createElement('script')
    script.src = '/vextab/div.prod.js'
    script.onerror = () => reject(new Error('Failed to load VexTab script'))
    script.onload = () => {
      let attempts = 0
      const checkForVexTab = () => {
        if (typeof window.vextab?.default === 'function') {
          resolve(window.vextab.default)
        } else if (++attempts >= 50) {
          reject(new Error('VexTab constructor not found on window object'))
        } else {
          setTimeout(checkForVexTab, 100)
        }
      }
      checkForVexTab()
    }
    document.head.appendChild(script)
  })

  vexTabPromise = pending.catch((e) => {
    vexTabPromise = null
    throw e
  })

  return vexTabPromise
}

export function configureCanvas(element: HTMLElement): void {
  element.setAttribute('width', '800')
  element.setAttribute('height', '200')
  element.setAttribute('renderer', 'svg')
  element.setAttribute('scale', '1.0')
}

export interface RenderedSheet {
  svg: SVGSVGElement
  tempo: number
}

// Draws a tab away from the page so a score can be produced without an editor
// mounted. The host must stay laid out - VexFlow measures text via getBBox.
export async function renderOffscreen(content: string): Promise<RenderedSheet | null> {
  const { code, hiddenRests } = prepareSource(content)
  if (!code.trim()) return null

  const VexTabDiv = await loadVexTab()

  const host = document.createElement('div')
  host.style.cssText = 'position:absolute;left:-10000px;top:0;width:800px'
  configureCanvas(host)
  document.body.appendChild(host)

  try {
    const div = new VexTabDiv(host)

    div.artist.reset()
    div.parser.reset()
    div.parser.parse(code)
    if (!div.parser.isValid()) return null

    div.artist.draw(div.renderer)
    hideRests(div.artist, hiddenRests)

    const svg = host.querySelector('svg')
    if (!svg) return null

    return {
      svg: svg.cloneNode(true) as SVGSVGElement,
      tempo: Number(div.artist.customizations.tempo) || DEFAULT_TEMPO
    }
  } finally {
    host.remove()
  }
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
