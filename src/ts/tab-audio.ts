import type { VexArtist, VexNote, VexStave } from './vextab'

const TICKS_PER_QUARTER = 4096

const SEMITONES: Record<string, number> = {
  c: 0,
  d: 2,
  e: 4,
  f: 5,
  g: 7,
  a: 9,
  b: 11
}

export type Legato = 'slide' | 'step' | 'tie'

export interface ScheduledNote {
  time: number
  duration: number
  midi: number[]
  legato: Legato | null
  x: number
  y: number
  height: number
}

function midiFromPlayNote(key: string): number | null {
  const [rawName, rawOctave] = key.split('/')
  if (!rawName || !rawOctave) return null

  const name = rawName.trim().toLowerCase()
  const letter = SEMITONES[name[0]]
  if (letter === undefined) return null

  let accidental = 0
  for (const character of name.slice(1)) {
    if (character === '#') accidental += 1
    else if (character === 'b') accidental -= 1
  }

  const octave = parseInt(rawOctave, 10)
  if (Number.isNaN(octave)) return null

  return octave * 12 + letter + accidental
}

export function frequencyOf(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function buildLegatoTargets(artist: VexArtist): Map<VexNote, Legato> {
  const toScoreNote = new Map<VexNote, VexNote>()

  for (const stave of artist.staves || []) {
    const tabVoices = stave.tab_voices?.length ? stave.tab_voices : [stave.tab_notes || []]
    const scoreVoices = stave.note_voices?.length ? stave.note_voices : [stave.note_notes || []]

    for (let v = 0; v < tabVoices.length && v < scoreVoices.length; v++) {
      const tabNotes = tabVoices[v] || []
      const scoreNotes = scoreVoices[v] || []
      for (let i = 0; i < tabNotes.length && i < scoreNotes.length; i++) {
        toScoreNote.set(tabNotes[i], scoreNotes[i])
      }
    }
  }

  const targets = new Map<VexNote, Legato>()

  for (const articulation of artist.tab_articulations || []) {
    const target = articulation.last_note
    if (!target) continue

    let kind: Legato = 'tie'
    if (articulation.slide_direction !== undefined) kind = 'slide'
    else if (articulation.text === 'H' || articulation.text === 'P') kind = 'step'

    targets.set(target, kind)

    const scoreNote = toScoreNote.get(target)
    if (scoreNote) targets.set(scoreNote, kind)
  }

  return targets
}

function noteCenterX(note: VexNote): number {
  const begin = note.getNoteHeadBeginX?.()
  const end = note.getNoteHeadEndX?.()

  return typeof begin === 'number' && typeof end === 'number'
    ? (begin + end) / 2
    : note.getAbsoluteX()
}

function staveExtent(stave: VexStave | null | undefined): [number, number] | null {
  if (!stave) return null

  const lines = stave.getNumLines?.() ?? 5
  return [stave.getYForLine(0), stave.getYForLine(Math.max(0, lines - 1))]
}

function systemBand(
  entry: VexArtist['staves'][number] | undefined,
  fallback: VexStave | null,
  scale: number
): { y: number; height: number } | null {
  const extents = [staveExtent(entry?.note), staveExtent(entry?.tab)].filter(
    (extent): extent is [number, number] => extent !== null
  )

  if (!extents.length) {
    const only = staveExtent(fallback)
    if (!only) return null
    extents.push(only)
  }

  const top = Math.min(...extents.map(([start]) => start))
  const bottom = Math.max(...extents.map(([, end]) => end))

  return { y: (top - 12) * scale, height: (bottom - top + 24) * scale }
}

export function buildSchedule(artist: VexArtist, tempo: number): ScheduledNote[] {
  const data = artist.getPlayerData()
  const scale = data.scale || 1
  const secondsPerTick = 60 / (tempo * TICKS_PER_QUARTER)
  const legatoTargets = buildLegatoTargets(artist)
  const byTick = new Map<number, ScheduledNote>()

  let staveStartTicks = 0

  for (let s = 0; s < data.voices.length; s++) {
    const voiceGroup = data.voices[s] || []
    let band: { y: number; height: number } | null = null
    let longestVoice = 0

    for (const voice of voiceGroup) {
      let ticks = 0

      for (const note of voice.getTickables()) {
        if (note.shouldIgnoreTicks()) continue

        const noteTicks = note.getTicks().value()
        const absoluteTick = staveStartTicks + ticks
        band = band ?? systemBand(artist.staves?.[s], note.getStave(), scale)

        const midi = note.isRest()
          ? []
          : (note.getPlayNote() || [])
              .map(midiFromPlayNote)
              .filter((value): value is number => value !== null)

        const existing = byTick.get(absoluteTick)
        if (existing) {
          existing.midi.push(...midi)
          existing.legato = existing.legato ?? legatoTargets.get(note) ?? null
        } else if (band) {
          byTick.set(absoluteTick, {
            time: absoluteTick * secondsPerTick,
            duration: noteTicks * secondsPerTick,
            midi,
            legato: legatoTargets.get(note) ?? null,
            x: noteCenterX(note) * scale,
            y: band.y,
            height: band.height
          })
        }

        ticks += noteTicks
      }

      if (ticks > longestVoice) longestVoice = ticks
    }

    staveStartTicks += longestVoice
  }

  return [...byTick.values()].sort((a, b) => a.time - b.time)
}

function pluckBuffer(context: AudioContext, midi: number): AudioBuffer {
  const { sampleRate } = context
  const frequency = frequencyOf(midi)
  const period = Math.max(2, Math.round(sampleRate / frequency))

  const decayTime = Math.max(0.6, 2.6 - frequency / 500)
  const length = Math.ceil(sampleRate * (decayTime + 0.2))
  const feedback = Math.exp(-6.9 / (frequency * decayTime))

  const buffer = context.createBuffer(1, length, sampleRate)
  const output = buffer.getChannelData(0)

  const line = new Float32Array(period)
  for (let i = 0; i < period; i++) line[i] = Math.random() * 2 - 1

  let smoothed = 0
  for (let i = 0; i < period; i++) {
    smoothed = smoothed * 0.4 + line[i] * 0.6
    line[i] = smoothed
  }

  let index = 0
  for (let i = 0; i < length; i++) {
    const current = line[index]
    const next = line[(index + 1) % period]
    output[i] = current * 0.6
    line[index] = (current + next) * 0.5 * feedback
    index = (index + 1) % period
  }

  const fade = Math.min(length, Math.round(sampleRate * 0.05))
  for (let i = 0; i < fade; i++) {
    output[length - fade + i] *= 1 - i / fade
  }

  return buffer
}

interface Voice {
  source: AudioBufferSourceNode
  baseMidi: number
  currentMidi: number
}

const RAMP_SECONDS: Record<Legato, number> = {
  slide: 0.14,
  step: 0.03,
  tie: 0
}

export class TabPlayer {
  onStep: ((index: number) => void) | null = null
  onEnd: (() => void) | null = null

  private context: AudioContext | null = null
  private master: GainNode | null = null
  private buffers = new Map<number, AudioBuffer>()
  private sources: AudioBufferSourceNode[] = []
  private frame = 0
  private schedule: ScheduledNote[] = []
  private originTime = 0
  private originOffset = 0

  play(schedule: ScheduledNote[], fromIndex = 0): void {
    this.stop()
    if (!schedule.length) return

    const context = this.ensureContext()
    if (context.state === 'suspended') context.resume()

    this.schedule = schedule
    this.originOffset = schedule[Math.min(fromIndex, schedule.length - 1)].time
    this.originTime = context.currentTime + 0.08

    let sounding: Voice[] = []

    for (const note of schedule.slice(fromIndex)) {
      const at = this.originTime + note.time - this.originOffset
      if (!note.midi.length) continue

      if (note.legato && sounding.length) {
        sounding = note.midi.map((midi) => this.glide(sounding, midi, at, note.legato as Legato))
      } else {
        sounding = note.midi.map((midi) => this.pluck(context, midi, at))
      }
    }

    this.track()
  }

  stop(): void {
    if (this.frame) {
      cancelAnimationFrame(this.frame)
      this.frame = 0
    }

    for (const source of this.sources) {
      try {
        source.stop()
      } catch {
        // already finished
      }
    }
    this.sources = []
  }

  dispose(): void {
    this.stop()
    this.context?.close()
    this.context = null
    this.master = null
    this.buffers.clear()
  }

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext()

      const compressor = this.context.createDynamicsCompressor()
      this.master = this.context.createGain()
      this.master.gain.value = 0.5
      this.master.connect(compressor)
      compressor.connect(this.context.destination)
    }
    return this.context
  }

  private pluck(context: AudioContext, midi: number, at: number): Voice {
    let buffer = this.buffers.get(midi)
    if (!buffer) {
      buffer = pluckBuffer(context, midi)
      this.buffers.set(midi, buffer)
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(this.master as GainNode)
    source.start(at)
    source.onended = () => {
      this.sources = this.sources.filter((candidate) => candidate !== source)
    }
    this.sources.push(source)

    return { source, baseMidi: midi, currentMidi: midi }
  }

  private glide(sounding: Voice[], midi: number, at: number, kind: Legato): Voice {
    let nearest = sounding[0]
    for (const voice of sounding) {
      if (Math.abs(voice.currentMidi - midi) < Math.abs(nearest.currentMidi - midi)) {
        nearest = voice
      }
    }

    const rate = Math.pow(2, (midi - nearest.baseMidi) / 12)
    const ramp = RAMP_SECONDS[kind]

    nearest.source.playbackRate.setValueAtTime(
      Math.pow(2, (nearest.currentMidi - nearest.baseMidi) / 12),
      at
    )
    if (ramp > 0) {
      nearest.source.playbackRate.linearRampToValueAtTime(rate, at + ramp)
    } else {
      nearest.source.playbackRate.setValueAtTime(rate, at)
    }

    nearest.currentMidi = midi
    return nearest
  }

  private track(): void {
    const context = this.context as AudioContext
    const last = this.schedule[this.schedule.length - 1]
    const endsAt = last.time + last.duration
    let step = -1

    const tick = () => {
      const elapsed = context.currentTime - this.originTime + this.originOffset

      let index = step
      while (index + 1 < this.schedule.length && this.schedule[index + 1].time <= elapsed) {
        index += 1
      }

      if (index !== step && index >= 0) {
        step = index
        this.onStep?.(index)
      }

      if (elapsed >= endsAt) {
        this.stop()
        this.onEnd?.()
        return
      }

      this.frame = requestAnimationFrame(tick)
    }

    this.frame = requestAnimationFrame(tick)
  }
}
