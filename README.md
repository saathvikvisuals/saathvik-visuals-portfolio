# Saathvik Visuals Portfolio

An interactive UI/UX portfolio brochure built as a premium experience platform.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Motion One
- Lenis
- GSAP
- React Three Fiber
- Drei
- Three.js
- Zustand
- Howler.js

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Project Automation

When a new Saathvik Visuals project is deployed, add its metadata to `project-intake.json` using `project-intake.example.json` as the format.

```bash
npm run projects:preview
npm run projects:sync
```

`projects:sync` classifies each project into Founder, Visual, Commerce, or Culture interests, writes `src/data/auto-projects.json`, and the portfolio automatically includes those projects in the matching curated rooms.

Deployment is automated too. `npm run build` runs `prebuild`, regenerates `src/data/auto-projects.json`, and then builds Next.js. On Vercel, connect this repo to GitHub and push the updated `project-intake.json`; Vercel will auto-deploy the portfolio with the updated curated projects.

Required fields:

- `name`
- `description`
- `url`
- `github`
- `image`

Optional fields like `tags`, `palette`, `problem`, `solution`, and `outcome` improve the curation quality.

## Contact Form SMTP

Set these in `.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=Saathvik Visuals <your-email@gmail.com>
CONTACT_TO=your-email@gmail.com
```

Then restart the dev server and run:

```bash
npm run contact:test
```
