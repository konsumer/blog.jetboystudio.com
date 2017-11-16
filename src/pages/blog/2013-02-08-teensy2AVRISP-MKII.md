---
title: Turning a Teensy++ 2 into a full AVRISP-MKII clone
date: 2013-02-08T18:00:00.000Z
tags:
  - electronics
  - micro-controllers
  - Arduino
  - XMEGA
  - LUFA
  - teensy
related:
  - post: /articles/teensy2AVRISP-MKII-lufa/
contentType: blog
path: /articles/teensy2AVRISP-MKII/
---

I needed a way to program the [XMEGA100 breakout board from Sparkfun](https://www.sparkfun.com/products/9546), and didn't have a "real programmer".

---

I currently use ArduinoISP running on a bare ATMEGA328 chip to program other ATMEGA chips, and it works great. If you buy a [AVRISP-MKII](http://www.atmel.com/tools/AVRISPMKII.aspx), it can do the same stuff, but also a special protocol (PDI) that the XMEGA board speaks, and TSI for small ATINY chips.

I want to just get started with my project, and not have to wait for shipping, plus I have a lot of stuff around the house like microcontrollers & dev boards, and don;t want to buy something for such a specialized purpose. Surely, there must be something I could put together.

I found [this](https://github.com/clockfort/Teensy-AVRISP-MKII) and I happen to have a Teensy++ 2 around, so I figured I was all set.  Had a look at the projects Makefile, and set paths up to use Arduino avr-gcc, etc.  Ran `make`, and got this error:

```
Lib/V2ProtocolParams.o: In function `V2Params_SetParameterValue':
/Users/konsumer/Documents/Projects/Teensy-AVRISP-MKII/Lib/V2ProtocolParams.c:166: undefined reference to `eeprom_update_byte'
collect2: ld returned 1 exit status
make: *** [AVRISP-MKII.elf] Error 1
```

o dear!

My first thought was maybe something was bad with Arduino version of avr-gcc toolset. I installed the excellent [CrossPack-AVR](http://www.obdev.at/products/crosspack/index.html) and restored the Makefile to pristine state. Closed my shell, and re-opened, ensured avr-gcc was in my path, and ran `make`.

Hmm... Same deal.

I started googling and found [this](https://groups.google.com/forum/#!msg/lufa-support/hp_R8QwHxH4/5UdPMbsjrmEJ). I have a sweet-ass Win7 VirtualBox, so I can install the newest WinAVR and be happy.

And that is what I did. Installed WinAVR, ran make, and got same error!

Ack. [Hulk starting to get angry](http://www.youtube.com/watch?v=7nrCvjg6nsI)!

Better check windows version of avr-gcc

```
E:\Documents\Projects\Teensy-AVRISP-MKII>avr-gcc --version
avr-gcc (WinAVR 20100110) 4.3.3
Copyright (C) 2008 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

Closed my Virtualbox in a wild fit of personal rage when I did this on my Mac:

```
avr-gcc --version
avr-gcc (GCC) 4.6.2
Copyright (C) 2011 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

It's a newer version!  Hmm.  Maybe I should return to [tha googlings](https://groups.google.com/forum/#!searchin/lufa-support/shift$20count$20%3E=$20width$20of$20type/lufa-support/-aKtGElksQU/59NrmU-yrYYJ).

I opened the makefile, and did a search for "linker", and found this section:

```makefile
#---------------- Linker Options ----------------
#  -Wl,...:     tell GCC to pass this to linker.
#    -Map:      create map file
#    --cref:    add cross reference to  map file
LDFLAGS  = -Wl,-Map=$(TARGET).map,--cref
LDFLAGS += -Wl,--relax 
LDFLAGS += -Wl,--gc-sections
LDFLAGS += $(EXTMEMOPTS)
LDFLAGS += $(patsubst %,-L%,$(EXTRALIBDIRS))
LDFLAGS += $(PRINTF_LIB) $(SCANF_LIB) $(MATH_LIB)
#LDFLAGS += -T linker_script.x
```

Added a line that looked like this after it:

```makefile
LDFLAGS += -lavr51/libc.a
```

Hmm, after make, now I get

```
Descriptors.c: At top level:
Descriptors.c:45:33: error: variable 'DeviceDescriptor' must be const in order to be put into read-only section by means of '__attribute__((progmem))'
Descriptors.c:72:40: error: variable 'ConfigurationDescriptor' must be const in order to be put into read-only section by means of '__attribute__((progmem))'
Descriptors.c:130:33: error: variable 'LanguageString' must be const in order to be put into read-only section by means of '__attribute__((progmem))'
Descriptors.c:141:33: error: variable 'ManufacturerString' must be const in order to be put into read-only section by means of '__attribute__((progmem))'
Descriptors.c:152:33: error: variable 'ProductString' must be const in order to be put into read-only section by means of '__attribute__((progmem))'
Descriptors.c:162:33: error: variable 'SerialString' must be const in order to be put into read-only section by means of '__attribute__((progmem))'
make: *** [Descriptors.o] Error 1
```

Changed everything back to pristine, same prob, without `avr51/libc.a` stuff. Wtf? Must have been something incomplete with my install. [Hulk starting to get angry, again](http://www.youtube.com/watch?v=7nrCvjg6nsI)!

Found [this](http://arduino.cc/forum/index.php/topic,66710.0.html) and thought maybe I should double check types. Added `const` to code on Descriptors.c which had PROGMEM. Got to next file Lib/ISP/ISPTarget.c, did same.  Whoah!  It built.

Fired up [Ye olde teensy loader](http://www.pjrc.com/teensy/loader_mac.html) and burnt that shit.

Unplugged it, and plugged it in. Open "System Report" (apple/about this mac/more info) and this what it had to say:

```
LUFA AVRISP MkII Clone:

  Product ID:	0x2104
  Vendor ID:	0x03eb  (Atmel Corporation)
  Version:	 2.00
  Serial Number:	0000A00128255
  Speed:	Up to 12 Mb/sec
  Manufacturer:	Dean Camera
  Location ID:	0x1d110000 / 7
  Current Available (mA):	500
  Current Required (mA):	Unknown (Device has not been configured)
```

Dang! So happy. [Life is rad](http://www.youtube.com/watch?v=VazV36eWHLc).

If you want the hex for your own Teensy++ 2, [here](/files/teensy_avrisp-mk2.zip) it is. Now you don't have to bother with all this silly bizness.

Looks like I may need to do something with that 'Unknown (Device has not been configured)' bit. dunno.









