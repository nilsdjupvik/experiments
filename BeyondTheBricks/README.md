# Beyond the Bricks

A three-minute 3D film with narration, followed by an explorable city. Built with three.js (r128), no build tooling.

- `index.html` is the whole page. It loads `three.min.js` and `beyond-the-bricks.mp3` from this folder.
- `src/` holds the page in parts; `sh build.sh` concatenates them back into `index.html`.

Open `index.html` directly, or view it on GitHub Pages at
https://nilsdjupvik.github.io/experiments/BeyondTheBricks/

Controls: Space pauses, arrow keys jump 5 seconds, the stud bar jumps between scenes.
In the city: drag to orbit, pinch or scroll to zoom. Add `#explore` to the address to skip the film.
