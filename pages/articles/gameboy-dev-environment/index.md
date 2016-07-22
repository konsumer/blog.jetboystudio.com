---
title:  "Gameboy development environment"
date:   2013-02-01 00:30:00
tags: [drunk, gameboy, development]
---

I do a lot of weird code stuff.  Recently, I was writing a [ROM for a Gameboy hardware-platform](https://github.com/konsumer/dkart).

Here is how I set it up my dev environment on Mac OS 10.8.2.

---

A lot of "old-timers" I talked to would have serious issues with my advice, but this made my preferred language work on my preferred OS using good tools, with as little fuss as possible. I am an older-timer, and I think it's good advice, as a general problem-solving approach.

I shouldn't have to use ASM, in Windows 98 to get things working the way I want. This is 2013, for God's sake. Let's try something better.

First install Xcode, so you can compile stuff. Install the command-line tools (fuzzy on this, did it a long time ago.)

Basically "make" and "gcc" should be in your path.

*  GBDK: I downloaded a [pre-compiled version](http://www.rpgmaker.it/proflame/gbdk.zip), and extracted to /opt/gbdk
*  RGBDS: I used [rgdbs-linux](http://github.com/bentley/rgbds/), and just ran `make`, seemed to work great. copied the whole folder into opt, so it was with the gbdk.
*  Emulator: I used visualboy advance. It doesn't have a debugger, but seems to run games ok. it associates with .gb and .gbc ROM files.
*  DOS tools: I got the wave tool and Advanced PCX2GB from [dos-tools](http://www.yvan256.net/projects/gameboy) extract them to /opt/dos
*  Windows Tools: I installed [Wine Bottler](http://winebottler.kronenberg.org/) and got no$gmb (32bit version, without sound) and all the windows tools from [Windows Tools](http://www.devrs.com/gb/hmgd/supp.html) to run, in a single prefix. This adds color image map/tile support, font support and more. no$gmb has a debugger, which is pretty rad, but I couldn't get the sound working. I bottled all the apps, so they have nice icons, and installed them all to one winebottler prefix, to save space. 

Now, install [DOSBox](http://www.dosbox.com) and add a mount command & tools to path in your autoexec. Do this by editing the bottom of ~/Library/Preferences/DOSBox 0.73 Preferences to look like this:

```
@echo off
mount H /Users/konsumer
mount D /opt/dos
set PATH=D:\;%PATH%
```

Replace "konsumer" with your username. Now you have access to your home dir (H:) & dostools (in path, D:)

I keep my projects in `~/Documents/Projects`. Here is how I make an image:

use gimp to make a PCX image 160x144 named in Documents/Projects/coolgame/logo.pcx
fire up dosbox

type these:

```
H:
cd Documents/Projects/coolgame
pcx2gb o d logo.pcx logo_tile.c logo_map.c
```

Looking at [DOSBox Usage](http://www.dosbox.com/wiki/Usage) I think you could add stuff that works from command-line, directly, but I didn't bother (it's not super-common that I need to make images or whatever.)

Then, I made a directory with a Makefile that looks like this:

```makefile
GBDK = /opt/gbdk
CC   = ${GBDK}/bin/lcc -Wa-l -Wl-m -Wl-j
RGB = /opt/rgbds/rgbfix

BINS   = mygame.gb

all:   $(BINS)

%.o:   %.c
   $(CC) -c -o $@ $<

%.s:   %.c
   $(CC) -S -o $@ $<

%.o:   %.s
   $(CC) -c -o $@ $<

%.gb:   %.o
   $(CC) -o $@ $<

%.gbc:   %.o
   $(CC) -o $@ $< && ${RGB} -vcs -l 0x33 -p 0 $@

clean:
   rm -f *.o *.lst *.map *.gb *.gbc *~ *.rel *.cdb *.ihx *.lnk *.sym *.asm
```

Make a file called mygame.c, that looks like this:

```c
#include <gb/gb.h>
#include <stdio.h>

#include "logo_tile.c"
#include "logo_map.c"

void main() {
    // load logo
    set_bkg_data(0,255, tiledata);
    VBK_REG = 1;
    VBK_REG = 0;
    set_bkg_tiles(0,0,20,18, tilemap);
    SHOW_BKG;
    DISPLAY_ON;

    waitpad(J_START);

    printf(" \n\n\n\n\n\n\n\nYour game goes here.\n");
    waitpad(J_START);
}
```

Now, you can run `make`, and it will compile mygame.c to mygame.gb. This is a basic boilerplate, you can do lots of other stuff, read docs on rgbfix for setting ROM title, etc.

As a sidenote, I used Sublime Text 2, a great code editor. You should get something that syntax-highlights.

It's also handy if you have a bunch of c files, you can run:

`make testsound.gb`, and it will compile testsound.c to testsound.gb

type `open mygame.gb` to run it.

You just made yer first gameboy game. Yer an "old-timer".


