My first big boy app.

# osu!web-editor

While we all wait for osu!next to make this obsolete, there's a few things I'd like to change about the current editor, and I want to learn React.

This obviously is not fully working yet.

## Installation

I don't actually know. First app and all.

`git clone` followed by `npm install` should handle all the dependencies. From there, `gulp` will build everything and run `http-server`, so you should see the page on `https://localhost:8080/`.

`gulp runq` will run `http-server` without building first.

`gulp build` will run will build with minification and optimizations - there's no point at this stage. `gulp buildq` is faster and leaves code human-readable.

There's no need to restart `http-server` when you build. Personally, I leave it running and build from Sublime Text.

## License

MIT for my code. Others for other people's.

## Notes for myself

star/pp timeline show when hovering song timeline
new keybinds
sync to server? but expensive
snapshot visible map section
slider velocity from snap divisor slider

https://github.com/pictuga/osu-web
https://github.com/oamaok/osu-pp-calculator
https://github.com/Ugrend/osuwebreplay
https://rarelyupset.com/oppai

osu!pixels - opx
scales with game res to keep playfield constant size
playfield = 512*384 opx = (4:3)*128
CS0 means circle radius is 54.42 opx
when doing fancy, get CS/AR specifics from hovering them in game
wiki may have formulas
CS diameter in is roughly 109 - 9*CS opx

grid is 16x12 at level 4 (every 32opx)
32x24 at 3 (every 16 opx)
64x48 at 2 (every 8 opx)
128x96 at 1 (every 4 opx)
so it just doubles dims ok