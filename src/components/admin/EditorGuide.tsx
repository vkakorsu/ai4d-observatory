/**
 * The editor guide as a page inside the CMS, at /admin/editor-guide, for signed-in users only.
 * It renders docs/EDITOR_GUIDE.md at request time, so the handover documentation and this page stay one
 * source (Section 3.1.10 f, "concise user documentation ... covering the principal CMS functions").
 * Registered in payload.config.ts under admin.components.views; next.config.ts traces the Markdown file
 * into the server bundle so it is present on serverless hosts and in the Docker image.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { marked } from 'marked'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'

const GUIDE_FALLBACK_URL = 'https://raw.githubusercontent.com/vkakorsu/ai4d-observatory/main/docs/EDITOR_GUIDE.md'

async function guideMarkdown(): Promise<string> {
  try {
    return await readFile(path.join(process.cwd(), 'docs', 'EDITOR_GUIDE.md'), 'utf8')
  } catch {
    // A host that did not trace the file still shows the guide, from the public repository.
    const res = await fetch(GUIDE_FALLBACK_URL, { next: { revalidate: 3600 } })
    return res.ok ? res.text() : '# Editor guide\n\nThe guide could not be loaded. It is in `docs/EDITOR_GUIDE.md` in the repository.'
  }
}

async function guideHtml(): Promise<string> {
  const md = await guideMarkdown()
  // The file's first heading carries a note for the documentation package; the page has its own title.
  const body = md.replace(/^#\s.*\r?\n/, '')
  return marked.parse(body, { gfm: true, async: false })
}

export async function EditorGuideView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Feditor-guide')

  const html = await guideHtml()
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <article className="ai4d-guide">
          <p className="ai4d-welcome__kicker">Asia AI4D Observatory · for editors</p>
          <h1>Editor guide</h1>
          <p className="ai4d-guide__lede">
            How to publish, tag, archive and export in this CMS. Visible only to signed-in editors and administrators.
          </p>
          <div className="ai4d-guide__body" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </Gutter>
    </DefaultTemplate>
  )
}

/** Link to the guide under the collections in the CMS navigation. */
export function EditorGuideNavLink() {
  return (
    <Link className="nav__link ai4d-nav-guide" href="/admin/editor-guide">
      <span className="nav__link-label">Editor guide</span>
    </Link>
  )
}
