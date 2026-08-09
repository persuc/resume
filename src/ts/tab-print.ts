import type { TabFile } from './tablature'
import { renderOffscreen } from './vextab'

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (character) => ESCAPES[character])
}

export function printSheet(tab: TabFile, svg: SVGSVGElement, tempo: number): void {
  const sheet = window.open('', '_blank')
  if (!sheet) return

  // Browsers seed the "Save as PDF" filename from the document title.
  const title = tab.artist ? `${tab.title} - ${tab.artist}` : tab.title

  sheet.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { margin: 1.5cm; }
  body { margin: 0; font-family: Georgia, 'Times New Roman', Times, serif; color: #111827; }
  h1 { font-size: 22pt; font-weight: 600; margin: 0; text-align: center; }
  .artist { font-size: 12pt; font-style: italic; color: #4b5563; margin: 4pt 0 0; text-align: center; }
  .tempo { font-size: 11pt; color: #374151; margin: 18pt 0 8pt; }
  .sheet { width: fit-content; max-width: 100%; margin: 0 auto; }
  svg { display: block; max-width: 100%; height: auto; }
</style>
</head>
<body>
<h1>${escapeHtml(tab.title)}</h1>
${tab.artist ? `<p class="artist">by ${escapeHtml(tab.artist)}</p>` : ''}
<div class="sheet">
<p class="tempo">&#9833; = ${tempo}</p>
${svg.outerHTML}
</div>
</body>
</html>`)

  sheet.document.close()
  sheet.focus()
  sheet.addEventListener('afterprint', () => sheet.close())
  sheet.print()
}

export async function printTab(tab: TabFile): Promise<boolean> {
  const rendered = await renderOffscreen(tab.content)
  if (!rendered) return false

  printSheet(tab, rendered.svg, rendered.tempo)
  return true
}
