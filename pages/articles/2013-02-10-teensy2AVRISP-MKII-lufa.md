---
title: Turning a Teensy++ 2 into a full AVRISP-MKII clone (better)
date: 2013-02-11T02:00:00.000Z
tags:
  - electronics
  - micro-controllers
  - Arduino
  - XMEGA
  - LUFA
  - teensy
path: /articles/teensy2AVRISP-MKII-lufa/
---

[Previously](/articles/teensy2AVRISP-MKII/) I went through a lot of hoops to figure out how to compile a Teensy version of a burner for my XMEGA.  This is a simpler version of those instructions.

---

And if you just want the hex file for teensy ++ 2, [here](/files/AVRISP-MKII-AT90USB1286.hex.zip).

Install [CrossPack-AVR](http://www.obdev.at/products/crosspack/index.html) to give your Mac avr-gcc. if you are on another OS, install winavr or avr-gcc however you do that.


Close terminal, and open a new one to refresh your environment.  Type `avr-gcc --version` and you should see something liek this:

```
avr-gcc (GCC) 4.6.2
Copyright (C) 2011 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

Download the [LUFA project](http://fourwalledcubicle.com/LUFA.php).

Edit Projects/AVRISP-MKII/makefile. Change MCU like to look like this:

```makefile
MCU          = at90usb1286
```

CD to Projects/AVRISP-MKII/ and type `make`

drag AVRISP-MKII.hex to your teensy burner window and press reset.

Now, you have a AVRISP-MKII clone!


