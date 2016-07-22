---
title: Humble Bundle in Emulator
date: '2014-03-17 16:29'
tags:
  - Android
  - emulation
  - games
  - Humble Bundle
  - quickie
path: /articles/humble-bundle-mobile-in-desktop
---

I have a bunch of [Humble Bundle](https://www.humblebundle.com/) Android games that I wanted to play on our house entertainment computer (hooked up to a projector!) Here is how I did it. This is also a guide if you want a really fast & performant Android emulator.

---

This may not be useful for gaming, actually, as many games wouldn't run/install which might be "Intel Atom x86" CPU type (which is needed by accelerated emulator.) I have an Ouya, so I might end up just using that, even though I was trying avoid having to switch cables. For the games that did work, I didn't bother installing a controller, but that would probably greatly improve overall experience.

*  Install the [Android SDK](http://developer.android.com/sdk/index.html). I put it in ~/bin/android-sdk-macosx/ and added ~/bin/android-sdk-macosx/tools to my path.  This is for mac, but should apply to whatever you use.
*  run `android`. Install "Android SDK Tools", one of the Android packs (I did "Android 4.4.2"), and "Intel x86 Emulator Accelerator (HAXM)"
*  Exit when it completes, and run `android avd`
*  Make a new AVD called "Nexus10" and set "Device" to "Nexus 10", CPU to "Intel Atom x86", check "Hardware keyboard present", set it to "No skin" and check "Use Host GPU"
*  Exit AVDManager
*  Install the [Intel HAXM patch](http://software.intel.com/en-us/android/articles/intel-hardware-accelerated-execution-manager)
*  run `LD_LIBRARY_PATH=~/bin/android-sdk-macosx/tools/lib/ ~/bin/android-sdk-macosx/tools/emulator64-x86 -avd Nexus10`
*  Download [Humble Bundle app](https://www.humblebundle.com/getapp)
*  Install with `adb install ~/Downloads/HumbleBundle-1.6.2.apk`
*  Login & install whatever you like!

Here are the games I tried, that seemed to run full speed!

*  Gunslugs (good keyboard support)
*  Kareteka Classic (weird with on-screen controls)

These had issues:

*  BADLAND Premium (crashed on run)
*  Bloons TD 5 (crashed on run)
*  Funky Smugglers (crashed on run)
*  Vector (crashed on run)
*  Punch Quest (crashed on run)
*  Jack Lumber (wouldn't install)
*  Hero Academy (wouldn't install)
*  Kingdom Rush (wouldn't install)
*  Ravensword: Shadowlands (crashed on run)
*  Swords & Soldiers HD (crashed on run)
*  Bard's Tale (installed, anddownloaded content,then crashed)
*  Breach & Clear (crashed on run)
