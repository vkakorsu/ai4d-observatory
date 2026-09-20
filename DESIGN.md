# DESIGN.md. Design decisions for the Asia AI4D Observatory

This file records the decisions behind the interface so an evaluator can see the reasoning, and so the design can be argued with rather than guessed at. Section 3.1.1(d) of the RFP asks for "a coherent visual language for the Observatory that works with Client and project-partner branding while giving the Observatory a distinct identity". The identity below is a proposed direction. It will be refined with LIRNEasia in weeks 2 and 3 of the work plan.

## 1. What we studied before drawing anything

**LIRNEasia's own identity.** Measured from lirneasia.net on 20 September 2026. Black wordmark, an orange-red node motif (roughly #c03020 to #f06030), theme reds #a92122 and #d11317, dark greys #343a40 and #3b3b3b, Fira Sans Condensed headings and Lato body. Dense, functional, evidence-first. Their DAP visualisations microsite uses restrained D3 choropleths with explanatory paragraphs.

**The AI4D network's conventions.** ai4d.ai and globalcenter.ai (both by Avani Tanya and Earthwhile). Editorial layouts, large headlines, featured-story modules, projects tagged by country and theme, an experts directory, calls with deadlines, a newsletter archive, funder logos in the footer, bilingual switch. global-index.ai (GIRAI) uses a country table with dimension scores and a toggle between an interactive map and a full list.

**Reference points for craft.** Government digital services with mature design systems (GOV.UK and the US Web Design System) for form patterns, focus states and plain-language error messages. Data journalism practice (small, labelled charts with honest scales and a table alongside) for the data pages. Editorial sites that set serif display type at scale for authority without decoration.

## 2. Decisions

### Typography
- **Display and long reading. Newsreader** (variable serif, SIL Open Font Licence). A serif signals research and policy in a way a geometric sans does not, and it separates the Observatory from LIRNEasia's condensed sans without clashing. We ship the weight-axis build only. Newsreader's optical-size build is 2.3 times heavier (279 KB against 123 KB for roman and italic), and for this audience page weight wins over a subtler display cut.
- **Interface and body. IBM Plex Sans** (variable, OFL). Neutral, highly legible at small sizes, and part of a family with Plex Sans Devanagari, Thai, Arabic and other scripts, which matters for the multilingual readiness in Section 3.1.5(f). Sinhala and Tamil are not in the Plex family. When those languages are added, Noto Sans Sinhala and Noto Sans Tamil are the planned companions.
- **Metadata and data. IBM Plex Mono** for dates, codes, indicator values and table numerals, with tabular figures so columns align.
- **Type scale.** Modular, based on 1.2 with a 17 px root on desktop and 16 px on mobile. Steps. 13, 14, 17, 20, 24, 29, 35, 42, 56. Headline leading 1.05 to 1.15, body leading 1.55. Tracking tightened by 1 to 2 percent above 35 px.
- **Loading.** Self-hosted through @fontsource packages, no third-party requests. Five Latin-subset WOFF2 files on an English page. Newsreader roman and italic (58 and 65 KB), Plex Sans variable (46 KB), Plex Mono 400 and 500 (15 KB each), about 200 KB in total, cached for a year after the first visit. `font-display: swap` with a tuned fallback stack (Georgia for Newsreader, Segoe UI and system sans for Plex) so text is visible immediately on a slow connection.

### Colour
- **Ink #1a1f1c.** Near-black with a green-grey cast. Softer than pure black on cream paper.
- **Paper #f7f5f0 and surface #ffffff.** Warm off-white background with white content panels. Reduces glare on long reading.
- **Accent vermilion #c8371f.** A relative of LIRNEasia's #d11317 and #a92122. Used sparingly for links, primary actions, the wordmark mark and the current-state indicator. Never used for data.
- **Moss #3f6b4f.** Confirmation states and secondary emphasis.
- **Ochre #c99a2e.** Sample-content and pending-decision badges, so the boundary between illustrative and real content is visible without shouting.
- **Data ramp.** Six-step teal-green sequential ramp for maps and charts (#e6efe9 to #25553f). Kept separate from the accent so nothing on a map reads as a link or an alert. No-data fill #f1efe9 with a hatched legend entry.
- **Neutrals.** Derived from ink at 8, 16, 32, 56 and 72 percent for rules, muted text and borders.
- **Contrast.** All text pairs meet WCAG 2.2 AA. Ink on paper 15.2 to 1. Muted text #5b605d on paper 6.4 to 1. Accent on paper 5.6 to 1. White on accent 5.6 to 1. White on moss 6.3 to 1.
- **No gradients, no glass, no drop shadows on cards.** Depth comes from the paper-and-panel distinction and from rules.

### Layout and grid
- Content column 72 rem maximum, reading column 44 rem for long text. Twelve-column grid on desktop with intentional asymmetric splits (7 and 5, 8 and 4) for lead stories and detail pages with a metadata sidebar.
- Spacing scale in rem. 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6. Section rhythm is 4 rem on desktop, 3 rem on mobile.
- Listing pages use a filter rail on the left at desktop widths and a collapsible filter panel on mobile. Results are a single-column list with strong typographic hierarchy rather than a grid of identical cards, because titles vary in length and the metadata matters more than a thumbnail.
- The home page leads with the mission statement, then one featured item at large scale beside three at small scale, then the map, then audience entry points, then latest items by type.

### Iconography and imagery
- One custom SVG icon set, 20 px grid, 1.5 px stroke, rounded caps. Icons denote content type and action only. No decorative icons.
- No stock photography. Content items without an image get a typographic cover generated from the type and title, so listings stay consistent when the Client has not supplied an image.
- The map is the only illustration on the home page. It is data, not decoration.
- The wordmark is typographic. "Asia AI4D Observatory" in Newsreader with a small vermilion mark formed from three offset squares, a nod to LIRNEasia's node motif without copying it. A final logo waits on Client sign-off.

### Interaction and states
- Visible focus ring on every interactive element. 3 px, ink coloured, offset 2 px, with a white inner ring on dark surfaces.
- Hover states change underline weight or background tint, never colour alone.
- Filters apply on change with JavaScript and on submit without it. The active filters are shown as removable chips above the results.
- Forms show the purpose of collection next to the field, validate on submit, and put errors in text next to the field and in a summary at the top.
- Loading states use a text label and a subtle progress bar, not a spinner. Empty states say what is empty and what to do.
- Motion is limited to 150 ms opacity and transform transitions and is disabled under `prefers-reduced-motion`.

### Data visualisation
- Server-rendered SVG. Every map has a legend with ranges, a text summary, a sortable table and a CSV link. Charts are small, labelled directly, with zero-based axes for counts and stated ranges for scores.
- Small states (Maldives, Singapore) get a marker at their centroid so they are not lost.
- Country shapes are keyboard focusable with a name and value in the accessible label.

## 3. What is deliberately unfinished
- The wordmark and colour are a direction. Two alternatives will be presented in week 2.
- Funder and partner marks are text placeholders until the Client supplies assets and usage rules.
- Photography policy (if any) is a Client decision.
