---
title: Hackintosh
date: 2017-05-26T20:20:05.000Z
tags:
  - mac
  - hackintosh
contentType: blog
path: /articles/hackintosh/
---

I have put together a few Hackintoshes over the years, but I was having trouble upgrading to OSX 10.12 (Sierra.) I left my machine alone, and just booted into Windows for a while, which made me very sad. These are the notes, after I really dug deep and put it back together again.

## hardware

Hardware is really important in putting together a Hackintosh. To save yourself some pain, get an Intel i5/i7, a fairly modern Geforce video card, and a hackintoshable motherboard.

Here's mine:

- [I7](http://www.intel.me/content/www/xr/en/processors/core/core-i7-processor.html)
- [GA-B75M-D3H](http://www.gigabyte.com/Motherboard/GA-B75M-D3H-rev-10)
- [NVIDIA GeForce GTX 950 2GB](http://www.geforce.com/hardware/desktop-gpus/geforce-gtx-950)
- 32 GB RAM
- 500GB SSD

I have some other bits and bobbles like a USB wifi dongle, which I won't get into in this article.

So, first I ran [OSX in VMWare](https://techsviewer.com/how-to-install-mac-os-x-el-capitan-on-vmware-on-pc/) to make my boot disk, because [Unibeast](https://www.tonymacx86.com/resources/unibeast-7-1-1.333/) only runs on OSX. If you haven't already, you're going to need to purchase Sierra in the App Store (inside the VM.) It took a while to boot, as it's really slow, but I followed the directions to get the disk made, and added [Clover Configurator](https://www.tonymacx86.com/resources/clover-configurator.328/) and [MultiBeast](https://www.tonymacx86.com/resources/multibeast-sierra-9-1-0.334/) to the disk. I also added the [Sierra Nvidia Webdrivers](https://www.tonymacx86.com/threads/nvidia-releases-alternate-graphics-drivers-for-macos-sierra-10-12-3-367-15-10-35.213122/), just in case my internet didn't work on reboot.

I setup my BIOS like this:

- Start with Optimized defaults
- SATA-mode should be AHCI
- added Unibeast USB as first boot disk
- left virtualization enabled (I will want this later)


If that doesn't get you booted, you might have to play with boot-flags, or remove some hardware or something.

Once it boots, you can use the menu to load "Disk Utility" and format the target drive. Make sure it's GUID and MacOS formatted. Go through the standard install, keep the Unibeast disk in. Once it reboots, choose your new installation to boot into.

On your fresh system, the graphics probly suck, and basic things don't work. Don't worry, just go through the wizard. Once you can run stuff, run Multibeast (that you put on the disk.) I used these settings, but your drivers are probly different:


- UEFI boot mode
- ALC888 Audio (which didn't work, but more about that later)
- All the disk drivers
- Just FakeSMC in "Misc", no plugins or anything
- Realtek RTL8111 v2.2.1 network
- 3rd party USB 3.0 and 7/8/9 Series in "USB"
- "NVIDIA Web Drivers Boot Flag" under "Customize"

After "Build" completed, I installed the web-drivers I downloaded and rebooted.

When it came back up, everything worked well except sound.

I found [this](https://github.com/toleda/audio_CloverALC/blob/master/audio_cloverALC-120.sh) which totally fixed it.

- First, I used Clover Configurator to mount my EFI partition.
- Next, I `chmod 755 audio_cloverALC-120.sh && ./audio_cloverALC-120.sh`


I got a [nice MacAlly keyboard](https://us.macally.com/products/103-key-full-size-usb-keyboard-with-short-cut-keys-for-mac) with a correctly-placed `⌘` key (next to spacebar) but if you need to modify a standard Windows keyboard, [see this](https://arstechnica.com/apple/2008/11/ars-guide-windows-to-mac-key-switching/) and add a `⌘` & `alt`/`option` sticker to make it awesome.


Now, everything seems to be working well, including video, sound, network, USB3, etc.
