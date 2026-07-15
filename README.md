# Moses Mungai — Portfolio Site

Static site (plain HTML/CSS, no build step) for `moses910.github.io`.

## Deploy to moses910.github.io

1. On GitHub, create a new repo named **exactly** `moses910.github.io` (this exact name is what makes GitHub serve it as your root user-page site).
2. Upload these files to the repo, keeping the folder structure:
   ```
   index.html
   about.html
   assets/css/style.css
   ```
3. Go to **Settings → Pages** in the repo. If the repo is named `moses910.github.io`, Pages is usually enabled automatically on the `main` branch — confirm the source is set to `main` / root.
4. Wait 1–2 minutes, then visit `https://moses910.github.io` to confirm it's live.

## Before I consider it "done"

- [✔] Confirm/replace the `[confirm start date]` placeholder in `about.html` under the TriqFlow entry — I didn't have an exact date so left it as a placeholder rather than guessing.
- [ ] Swap any copy you want phrased differently — everything here is a first draft based on what we discussed.
- [ ] Real screenshots: the Selected Work cards are currently text-only. Swap in real screenshots/diagrams when ready (e.g. LambdaCostWatchdog's architecture, the fraud engine console) — there's no image markup yet, so this is an intentional next step, not a bug.
- [ ] Point your LinkedIn / GitHub profile / old Google Sites "Get in touch" links to the new URL once you're happy with it.

## Notes on what's included

- Design tokens, type system, and the Selected Work card styling all carry over from what we built for the Google Sites embed — so this should feel identical to what you already reviewed, just faster and no longer boxed into an iframe.
- Fonts are still loaded from Google Fonts via `<link>` (not `@import`, which was the slow part before). Self-hosting the font files locally would remove the external request entirely — let me know if you want that as a follow-up once the site's live and you want to squeeze out more load-time.
- No JavaScript is used anywhere — pure HTML/CSS, so there's nothing to break and nothing blocking render.
