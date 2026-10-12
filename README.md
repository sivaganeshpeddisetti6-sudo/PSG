# Siva Ganesh Peddisetti — Vercel portfolio

A white, black, and vivid-orange portfolio with an interactive Three.js systems scene. Select a project to rearrange the modules, drag or use arrow keys to rotate, and use the slider to separate them. Reset view restores the camera controls. Research remains static. Reduced-motion preferences make scene transitions immediate.

Keep index.html, design.css, experience.js, favicon.svg, and vendor/ together. Three.js is bundled locally; licenses are in vendor/. Google Fonts has system-font fallbacks.

## Preview

Serve this folder over HTTP, for example with `npx serve .`. Do not open index.html directly: browser module loading requires HTTP.

## Deploy to Vercel

Import this folder as a repository, or run the Vercel CLI from this folder:

    npx vercel login
    npx vercel --prod

Use the Other framework preset, no build command, and the current folder as the output directory. No environment variables or dependency installation are required for the site itself.

Resume buttons open the supplied Google document and its PDF export; access depends on that document's sharing settings. Social links open LinkedIn and Instagram. Contact and story submissions open the visitor's email application; the site does not store submissions.
