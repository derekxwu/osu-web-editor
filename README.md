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

CS object radii: 54.42 - 4.482 * CS
0: 54.42
1: 49.94
2: 45.46
2.2: 44.56
2.3: 44.11
2.4: 43.67
2.5: 43.22
2.6: 42.77
2.7: 42.32
2.8: 41.87
2.9: 41.42
3: 40.98
3.5: 38.74
4: 36.49
4.5: 34.25
5: 32.01
5.5: 29.77
6: 27.53
6.5: 25.29
7: 23.05
7.5: 20.81
8: 18.57
8.5: 16.33
9: 14.09
9.5: 11.84
10: 9.6

AR times: - not recalculated for HT/DT; <audio> changes playback rate by itself
Piecewise linear
0: 1800ms
1: 1680ms
2: 1560ms
3: 1440ms
4: 1320ms
4.2: 1296ms
4.3: 1283ms
4.4: 1271ms
4.5: 1260ms
4.6: 1248ms
4.7: 1236ms
4.8: 1223ms
4.9: 1211ms
5: 1200ms !!! Break point
5.2: 1170ms
5.3: 1154ms
5.4: 1139ms
5.5: 1125ms
5.6: 1110ms
5.8: 1079ms
6: 1050ms
7: 900ms
8: 750ms
9: 600ms
10: 450ms

OD windows: 78-6*OD / 138-8*OD / 198-10*OD
10: 18/58/98
9: 24/66/108
8: 30/74/118
7: 36/82/128
6: 42/90/138
5: 48/98/148
4: 54/106/158
3: 60/114/168
2: 66/122/178
1: 72/130/188
0: 78/138/198

cloudflare? travis? - calm down derek

getPointAtLength :))))

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