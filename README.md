# Dr. Amreen, Pediatrician

Website for Dr. Amreen, Pediatrician at Caspian Healthcare, Vijaya Nagar
Colony, Hyderabad.

## Stack

- Vite + React 19 + React Router 7
- Deployed on Vercel (Caspian Studio team)
- Enquiry form writes to Supabase project `drkhizerjunaidy`, table
  `public.amreen_enquiries`. The anon key can INSERT only. Reading goes through
  the SECURITY DEFINER function `amreen_enquiries_list(passcode)`.

## Where to change things

| What | File |
|---|---|
| Name, degrees, registration, clinic address, phone, OPD hours, fee, booking link | `src/data/site.js` |
| Page titles and meta descriptions | `src/data/routes.js` |
| Parent's Corner article content | `src/data/articles.js` |
| Design tokens (colours, type scale, spacing) | `src/index.css` |

`src/data/site.js` is the single source of truth. Changing the phone number
there updates the navbar, footer, contact page, appointment page and the
schema.org data together.

## Build

`npm run build` runs `vite build` and then `scripts/build-routes.mjs`, which
writes a real HTML file per route with its own title, description, canonical and
Open Graph tags, plus `sitemap.xml` and `robots.txt`. Vercel serves those static
files before the SPA fallback in `vercel.json`, so crawlers and WhatsApp
previews get correct metadata without running JavaScript.

## Private pages

`/enquiries` is a passcode-gated inbox for the clinic team. It is excluded from
the sitemap and disallowed in robots.txt. Change the passcode by editing the
`amreen_enquiries_list` function in Supabase.
