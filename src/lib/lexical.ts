import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/** Build Lexical editor state from plain text. Used by the seed so sample copy is real rich text, not HTML strings. */

const text = (t: string) => ({ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })

const paragraph = (t: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
  children: [text(t)],
})

const heading = (t: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: [text(t)],
})

const list = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: items.map((t, i) => ({
    type: 'listitem',
    value: i + 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [text(t)],
  })),
})

const root = (children: unknown[]): SerializedEditorState =>
  ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }) as unknown as SerializedEditorState

export const paragraphs = (...texts: string[]): SerializedEditorState => root(texts.map(paragraph))

export type Block = { h?: string; h3?: string; p?: string; li?: string[] }

export const richText = (blocks: Block[]): SerializedEditorState =>
  root(
    blocks.flatMap((b) => {
      const out: unknown[] = []
      if (b.h) out.push(heading(b.h))
      if (b.h3) out.push(heading(b.h3, 'h3'))
      if (b.p) out.push(paragraph(b.p))
      if (b.li) out.push(list(b.li))
      return out
    }),
  )

/** Plain text of an editor state, for excerpts and tests. */
export const plainText = (state: SerializedEditorState | null | undefined): string => {
  if (!state?.root) return ''
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { type?: string; text?: string; children?: unknown[] }
    if (n.type === 'text') return n.text ?? ''
    const inner = (n.children ?? []).map(walk).join('')
    return n.type === 'paragraph' || n.type === 'heading' || n.type === 'listitem' ? `${inner}\n` : inner
  }
  return walk(state.root).trim()
}
