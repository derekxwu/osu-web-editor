My first big boy app.

# osu!web-editor

While we all wait for osu!next to make this obsolete, there's a few things I'd like to change about the current editor, and I want to learn React.

This obviously is not fully working yet.

A lot of the slider implementation is owed to [opsu!](https://github.com/itdelatrisu/opsu).

## Installation

This project depends on [osu-parser-web](https://github.com/derekxwu/osu-parser-web) (included in lib/ for now), forked from [oamaok/osu-parser-web](https://github.com/oamaok/osu-parser-web)

I don't actually know. First app and all.

`npm install` should handle all the dependencies. From there, `gulp` will build everything and run `http-server`, so you should see the page on `https://localhost:8080/`.

`gulp run` will run `http-server` without building first.

`gulp build` does the obvious, `gulp build:p` does a production build with minification and such.

## License

MIT for my code. Others for other people's.

## Notes for myself

### features?

* star/pp timeline show when hovering song timeline
* hp timeline so you don't screw HR players
* new keybinds
* sync to server? but expensive
* snapshot visible map section
* slider velocity from snap divisor slider
* circle/sldier/spinner counts
* show min od to prevent note lockout
* timing - use bpm, offset, spectrogram/waveform instead of weird timing thing
* Google Drive realtime API
* paperjs - would require rewrite?
* Since this is a rhythm game, prioritize audio, have react update as it can

***

### educational material

* [https://github.com/pictuga/osu-web](https://github.com/pictuga/osu-web)
* [https://github.com/oamaok/osu-pp-calculator](https://github.com/oamaok/osu-pp-calculator)
* [https://github.com/Ugrend/osuwebreplay](https://github.com/Ugrend/osuwebreplay)
* [https://rarelyupset.com/oppai](https://rarelyupset.com/oppai)
* [https://github.com/nojhamster/osu-parser](https://github.com/nojhamster/osu-parser)
* [https://github.com/itdelatrisu/opsu/](https://github.com/itdelatrisu/opsu/)

### notes

osu!pixels (opx)  
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

cloudflare? travis?

### architecture

separate UI from data?

hitobjects as array of combo pieces (NCs) sorted by time  
each of the combos is an array of objects contained, sorted by time  
assume hitobjects are already sorted by time  
big mega object array? read on react keys

Top level state holds:
* beatmap
* audio file/bg
	- custom samples?
* beatmap set
* timestamp
* playing/notplaying
    - timeupdate
    - progress
    - ratechange
* current selection
* active toggles (placing objects, snaps/locks)
* undo history in state
	* history is stack-like - allow undoing of not top?
		* but have to make sure it doesn't affect above, or that above is handled


slider drawing will be a pain  
svg has bezier path and stroke built in?  
	snaking sliders?  
	https://osu.ppy.sh/wiki/Slider#Slider_Speed  
	slider speed: speed of 1 = 100opx/beat  
	linear, bezier, catmull, perfect (circles)  
		only draw bezier, fail on others?

[hit objects](https://github.com/derekxwu/osu-wiki/blob/patch-1/wiki/osu!_File_Formats/Osu_\(file_format\)/en.md#hit-objects)