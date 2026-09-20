# Editor guide (draft for the Documentation Package)

This is the working draft of the CMS/editor guide named in Section 3.2 of the RFP ("Documentation Package"). It describes the prototype as it stands. At handover it is finalised with screenshots of the agreed design, the Client's taxonomy terms and the Client's publishing conventions, and delivered alongside the recorded training sessions (Section 3.1.10).

The administrative dashboard is at `/admin`. Sign in with the email address and password you were given. Sessions last eight hours. After five failed sign-in attempts an account is locked for ten minutes.

## 1. Roles

| Role | Can | Cannot |
|---|---|---|
| Administrator | Everything below, plus create and manage user accounts, edit Site settings and the Home page, permanently delete records and content, restore from Trash | |
| Editor | Create, edit, publish, unpublish, schedule and archive (move to Trash) any content; manage taxonomies, people, organisations and media; view and export download requests, subscribers and registrations; restore from Trash | Manage users, edit Site settings |
| Contributor | Create and edit drafts of any content; upload media | Publish, archive, delete, see records, edit taxonomies |

If a Contributor presses Publish the CMS refuses with the message "Contributors can save drafts but not publish. Ask an editor to publish this item." Their draft is kept.

## 2. The five verbs. Create, edit, publish, unpublish, archive

| You want to | Do this | What happens |
|---|---|---|
| Create | Open the collection in the left menu, press **Create new** | A draft is created. Autosave runs every 1.5 seconds. Nothing is public |
| Edit | Open the item, change fields, press **Save draft** or **Publish** | Every save is a version. Up to 25 versions are kept per item |
| Publish | Press **Publish**, or open the arrow next to it and choose **Schedule publish** for a date and time | The item appears on the site, in listings, hub pages, search, feeds and the sitemap within a minute |
| Unpublish | Open the arrow next to **Publish** and choose **Unpublish** | The public URL returns "not found" and the item leaves listings and search. The content is kept as a draft and can be republished |
| Archive | Press **Move to Trash** (three-dot menu, top right) | The item leaves the site, the search index and the public API, keeps its full history, and sits in **Trash** where an editor can **Restore** it. Permanent deletion is a separate, confirmed step from Trash |
| Restore an earlier version | Open **Versions** in the item's top bar, pick a version, press **Restore this version** | The chosen version becomes the current draft; publish to make it live |

Publishing state is shown as a badge on every item: **Draft**, **Published**, or **Changed** (published, with unpublished edits).

## 3. Structured content, not free-form pages

Every module in Section 3.1.2 of the RFP is its own content type with its own fields. Fill the fields rather than putting everything in the body text; the fields drive filters, hub pages, search, related content and the social sharing preview.

| Content type | Where it appears | Fields that matter most |
|---|---|---|
| Use case | `/use-cases`, country and enabler hubs, home | Country, sector, responsible AI dimensions, enablers, stage, organisations, year |
| Publication | `/publications`, hubs, home | Type (report, mapping study, annual report, research/policy/innovation brief, toolkit, comparative analysis), file or external link, authors, date |
| Dataset | `/datasets` | Source, method notes, licence, files or access links, related indicators |
| Indicator and indicator value | `/data`, home map | One indicator value per country per year. Add a value and the map, chart, table and CSV update |
| Blog post, op-ed, news | `/commentary` | Authors, topics, and for op-eds the external link |
| Person, organisation | `/directory` | Stakeholder type from the taxonomy (Government, Private sector, Civil society or NGO, University or research institution, Regional or international body, Funder), role in the Observatory, expertise, countries |
| Event | `/events` | Start and end, format, venue or online link, registration mode (external link or on-site form), capacity, closing date |
| Learning resource | `/learning` | Resource type (course, video, toolkit, guide, framework, reading list), level, link or file, video URL |
| Opportunity | `/opportunities` | Type, deadline, provider, eligibility, application link. Expired opportunities move to the "past" list automatically |
| Newsletter issue | `/newsletter` | Issue date, web version body, PDF |
| Page | `/about`, `/privacy`, `/accessibility` and any new page | Title, body. Used for the few free-form pages the site needs |

Every content type also carries **Summary** (one to three sentences, shown in listings, search results and social previews), **Provenance** (sample, public record or client content), **SEO** overrides (title, description, image, no-index) and a **Slug** (generated from the title, editable, must stay unique).

## 4. Taxonomies

Country, Topic (sector), Enabler, Responsible AI dimension, Stakeholder type and Tag live under **Taxonomies**. Editors add, rename and describe terms; every listing, filter and hub page follows. To merge two terms, re-tag the items first and then delete the empty term. Deleting a term removes it from every item that carried it, so check the term's hub page (for example `/topics/health`) is empty before deleting.

Conventions to agree at handover: sentence case for names, one line of description per term, and no new Tag without checking whether a Topic or Enabler already covers it.

## 5. Media and downloads

Under **Media**, upload images, PDFs, CSV, XLSX, DOCX, JSON or ZIP files up to 50 MB. **Alt text is required**: describe the image for someone who cannot see it, or give the document's title. Images are resized and converted to AVIF/WebP automatically.

Set **Access** to **Email-gated download** to require an email address before the file is released. The **Purpose statement** shown next to the form is editable per file. Each request is recorded under **Records → Download requests** with the consent text and version the person saw. Files marked gated cannot be reached through the ordinary file URL.

To embed a video, paste a YouTube or Vimeo watch URL into the video field. The site uses the privacy-enhanced embed and links to the original for captions and transcripts.

## 6. Records and exports

**Records** holds Download requests, Subscribers and Event registrations. Nothing here is public. Editors can view, filter and export; only administrators can delete.

To export: open the collection, optionally filter (for example one event, or one month), press **Export**, choose CSV or JSON and the columns, then **Download**. Exports are generated on the spot; a copy is also kept under Records → Exports for the audit trail. The same Export button exists on every content and taxonomy collection, so the full content set can be exported without a developer.

Subscriber records are also sent to the connected newsletter service (Brevo or Mailchimp, in the Client's account). If the service is not yet connected, records are held in the CMS and can be exported and imported into the service later.

## 7. Site settings and the home page

**Globals → Site settings**: site name, tagline, description, contact email, social links, funder and partner marks, programme note, the site-wide announcement bar, consent statements (download, newsletter, registration) with a consent version, the retention period for records, and the switch that shows or hides "Sample content" labels.

**Globals → Home**: the headline and introduction, the featured items, the indicator shown on the home page map, and the "Start from what you need" audience entries and their links.

When you change a consent statement, increase the **Consent version** so new records show which wording they agreed to.

**Retention period (months)** is enforced automatically. Every night the site deletes download requests and event registrations older than this period. Subscribers are never deleted automatically; they stay until they unsubscribe. If you change the period, update the Privacy page so the two agree.

## 8. Analytics

The site fires page views and events (download, gated unlock, newsletter subscribe, event registration, dataset access, opportunity opened, search) to the configured analytics service. With self-hosted Umami, staff sign in to the Umami dashboard to see visits, page views, referrers, countries, devices, UTM sources and the event counts, and can export CSV from any report. Training session 2 covers this; the analytics guide is delivered with it.

## 9. Good practice

- Write the summary first. It is what most people read.
- Tag with the taxonomy fields, not with words in the body.
- Give every image alt text that says what it shows, and every document its title.
- Use headings in order (Heading 2, then Heading 3) in body text. Do not use bold for headings.
- Link text should say where it goes ("Read the mapping study"), not "click here".
- Prefer Unpublish for temporarily withdrawing an item and Move to Trash for retiring it. Both are reversible.
- Check the preview on a phone-sized window before publishing.
