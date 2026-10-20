# GSS website

Company website for Globalsmart Solution LLC (gssgroup.mn). Next.js (App Router) exported as a static site, Mongolian and English.

## Structure

- `src/content/site.ts` — the sitemap and all page titles/summaries in both languages. Add a page by adding a node; routes are generated from it.
- `src/app/[lang]/page.tsx` — home page.
- `src/app/[lang]/[...slug]/page.tsx` — template for every other page.
- `src/components/InquiryForm.tsx` — request form; fields match the ERP *Inquiries* list.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_STAGING=1` | Shows the staging banner and pending-content notes, and sets `noindex`. |
| `NEXT_PUBLIC_BASE_PATH` | `/gss-website` on GitHub Pages staging, empty on the production domain. |
| `NEXT_PUBLIC_INQUIRY_ENDPOINT` | Where the form posts. Empty = form shows a staging notice and sends nothing. |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000/mn/
npm run build      # static output in ./out
```

Pushing to `main` deploys staging via `.github/workflows/deploy-staging.yml`.
