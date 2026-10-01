# Project screenshots

One folder per project, named after the project's `id` in `src/data/projects.ts`.
Every project already has a folder, including the ones with no public URL — drop
images in and they show up.

## Dropping images in by hand

1. Put PNG or JPEG files in the project's folder.
2. Name them `1`, `2`, `3`, … — they are shown in that order (`10` sorts after
   `9`, not after `1`).
3. That is all. `npm run dev` and `npm run build` re-index the folders first, so
   the gallery picks the new files up with no code change.

The gallery lays itself out from each image's own proportions, so the files do
not have to be the same size — but a project whose shots are all taken at one
device width looks considerably tidier than a mixed set.

An image the indexer cannot measure is skipped with a warning rather than
shipped broken; if that happens, re-export it as a normal PNG or JPEG.

## Re-capturing the live sites

```bash
npm run shots              # every project with a public URL
npm run shots -- seltrip   # just one
```

Capture settings — the address, the device frame, and any clicks needed to get
past an intro screen — live in `SHOT_TARGETS` in `scripts/shoot.mjs`. The script
takes the entry screen, then whatever the site links to, and falls back to
scrolling down the entry page, up to five frames per project.

**Hand-added files are overwritten by `npm run shots`** — it clears a project's
folder before re-capturing it. Keep anything you want to survive outside these
folders, or re-add it afterwards.
