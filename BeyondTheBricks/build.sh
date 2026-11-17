#!/bin/sh
# Rebuilds index.html from the parts in src/. Run from this folder.
set -e
{ sed 's#<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>#<audio id="snd" preload="auto" src="beyond-the-bricks.mp3"></audio>\n<script src="three.min.js"></script>#' src/head.html
  cat src/1core.js src/2world.js src/3actors.js src/4film.js src/9tail.html; } > index.html
