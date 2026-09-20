/**
 * Generates small, valid sample files at seed time so downloads and gating can be exercised.
 * No binary assets are committed. Real documents are uploaded by editors.
 */

const pdfEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

/** A one-page PDF with a title, a label and a few lines of text. Helvetica, A4. */
export const samplePdf = (title: string, lines: string[]): Buffer => {
  const content: string[] = []
  content.push('BT')
  content.push('/F1 20 Tf 56 780 Td')
  content.push(`(${pdfEscape(title)}) Tj`)
  content.push('/F1 10 Tf 0 -28 Td')
  content.push('(SAMPLE DOCUMENT. Generated for the Asia AI4D Observatory prototype. Not an Observatory output.) Tj')
  content.push('/F1 12 Tf 0 -36 Td')
  for (const line of lines) {
    content.push(`(${pdfEscape(line)}) Tj`)
    content.push('0 -18 Td')
  }
  content.push('ET')
  const stream = content.join('\n')

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let out = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(out, 'latin1'))
    out += `${i + 1} 0 obj\n${obj}\nendobj\n`
  })
  const xref = Buffer.byteLength(out, 'latin1')
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const o of offsets) out += `${String(o).padStart(10, '0')} 00000 n \n`
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(out, 'latin1')
}

export const sampleCsv = (headers: string[], rows: Array<Array<string | number>>): Buffer =>
  Buffer.from([headers.join(','), ...rows.map((r) => r.join(','))].join('\n'), 'utf8')

/** A tiny SVG used as a sample image when an item needs one. Never a photograph. */
export const sampleSvg = (label: string, fill = '#c3d9cc'): Buffer =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="810" viewBox="0 0 1440 810"><rect width="1440" height="810" fill="#efece4"/><polygon points="0,810 1440,300 1440,810" fill="${fill}" opacity="0.7"/><text x="72" y="120" font-family="Georgia, serif" font-size="56" fill="#1a1f1c">${label}</text><text x="72" y="170" font-family="Arial, sans-serif" font-size="20" fill="#5b605d">Sample image pending client asset</text></svg>`,
    'utf8',
  )
