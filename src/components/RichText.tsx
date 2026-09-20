import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * Renders Lexical editor state to React. No raw HTML is injected.
 * Long-form body copy is set in the serif reading style.
 */
export function RichText({
  data,
  serif = false,
  className = '',
}: {
  data: SerializedEditorState | null | undefined
  serif?: boolean
  className?: string
}) {
  if (!data || !data.root || !Array.isArray(data.root.children) || data.root.children.length === 0) return null
  return (
    <LexicalRichText
      data={data}
      className={['prose', serif ? 'prose--serif' : '', className].filter(Boolean).join(' ')}
      disableContainer={false}
    />
  )
}
