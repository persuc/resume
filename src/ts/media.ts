export type MediaKind = 'youtube' | 'spotify'

export interface MediaEmbed {
  kind: MediaKind
  src: string
  title: string
  height: number
}

const YOUTUBE_HOSTS = ['youtube.com', 'music.youtube.com', 'm.youtube.com']
const SPOTIFY_TYPES = ['track', 'album', 'playlist', 'episode', 'show']

const SPOTIFY_HEIGHTS: Record<string, number> = {
  track: 152,
  episode: 152,
  album: 352,
  playlist: 352,
  show: 352
}

function parseStart(value: string | null): number {
  if (!value) return 0

  const seconds = Number(value.replace(/s$/, ''))
  if (!Number.isNaN(seconds)) return Math.max(0, Math.floor(seconds))

  const parts = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!parts) return 0

  const [, hours, minutes, rest] = parts
  return Number(hours || 0) * 3600 + Number(minutes || 0) * 60 + Number(rest || 0)
}

function youtubeEmbed(id: string, url: URL | null): MediaEmbed | null {
  if (!/^[\w-]{6,64}$/.test(id)) return null

  const start = url ? parseStart(url.searchParams.get('t') ?? url.searchParams.get('start')) : 0

  return {
    kind: 'youtube',
    src: `https://www.youtube.com/embed/${id}${start ? `?start=${start}` : ''}`,
    title: 'YouTube player',
    height: 0
  }
}

function spotifyEmbed(type: string, id: string): MediaEmbed | null {
  if (!SPOTIFY_TYPES.includes(type) || !/^[a-zA-Z0-9]{6,64}$/.test(id)) return null

  return {
    kind: 'spotify',
    src: `https://open.spotify.com/embed/${type}/${id}`,
    title: 'Spotify player',
    height: SPOTIFY_HEIGHTS[type] ?? 152
  }
}

export function parseMediaLink(raw: string | undefined): MediaEmbed | null {
  const value = raw?.trim()
  if (!value) return null

  const uri = value.match(/^spotify:([a-z]+):([a-zA-Z0-9]+)$/)
  if (uri) return spotifyEmbed(uri[1], uri[2])

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null

  const host = url.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    return youtubeEmbed(url.pathname.slice(1), url)
  }

  if (YOUTUBE_HOSTS.includes(host)) {
    if (url.pathname === '/watch') {
      const id = url.searchParams.get('v')
      return id ? youtubeEmbed(id, url) : null
    }

    const path = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)/)
    return path ? youtubeEmbed(path[1], url) : null
  }

  if (host === 'open.spotify.com') {
    const path = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?([a-z]+)\/([a-zA-Z0-9]+)/)
    return path ? spotifyEmbed(path[1], path[2]) : null
  }

  return null
}
