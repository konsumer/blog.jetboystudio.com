---
title: The Making of GothLappy, My Sweet Hackintosh Laptop
date: 2017-05-06T16:00:00.000Z
tags:
  - mac
  - hackintosh
  - laptop
path: /articles/hackintosh2/
---

I realized [this article](/articles/hackintosh/) about my hackintosh desktop is pretty basic and rough, and I thought I would go into more detail about installing OSX Sierra (10.12) with my new Acer Aspire E5-575 laptop.
I want to dual-boot it with Windows, just for fun (and because I fear Acer is kinda Windows-centric,) but you could also [triple-boot with linux](http://lifehacker.com/5698205/how-to-triple-boot-your-hackintosh-with-windows-and-linux).

Basically, there are 2 main factions of hackintosh forums/developers: [tonymacx68](https://www.tonymacx86.com) and [insanelymac](http://www.insanelymac.com). I [recently read](http://prasys.info/2011/01/tonymac-seriously/) that tonymacx86 hadn't given proper credit for the awesome work that other developers (who mostly hangout on insanelymac) have put in to make hackintoshing work so well, which all his stuff is based on. [Multibeast & Unibeast](https://www.tonymacx86.com/resources/categories/tonymacx86-downloads.3/) is what I have used in the past, and it was really easy, but [Pandora's Box](http://www.insanelymac.com/forum/files/file/11-pandoras-box-os-x-installer/) looks like it offers a bit more control and also seems pretty easy, so this time I'll try that.

You're going to need a running mac to do stuff. I used my Sierra desktop hackintosh, but I have heard of people using display models at the Mac store, or getting a friend to make them a disk. When I made my desktop system, I [used VMWare](https://techsviewer.com/how-to-install-mac-os-x-el-capitan-on-vmware-on-pc/), running on Windows to get El Capitan booted, made the disk, then did the rest from there.

I hit "play" on [Synapscape](https://open.spotify.com/artist/2nRBvPfp31TNHx6Q5PkRaQ) and started drinking good ole [Coors Banquet Beer](https://www.coors.com/). I should totally get sponsorship from cheap beer companies.

## hardware

It's not cutting-edge or fancy hardware by any means, but I liked the Aspire E5-575-33BM for the price (under $400), the look (all black, but sorta macpro-ish keyboard/trackpad), 12hour battery-life, and my initial research says I should be able to hackintosh it. If not, it'll make a just-fine Linux laptop for a good price, so I won't be heartbroken.

The main troublesome elements of the hardware (that I anticipate) are:

* Intel Core™ i3-7100U dual-core 64bit Kabylake
* Intel HD integrated Graphics 620
* Qualcomm Atheros NFA435A wifi. Often hackintoshing doesn't work with integrated wifi cards found in laptops, so I am prepared to get a new card, if needed
* Power Management - this often doesn't work on laptops, and can be tricky to troubleshoot, so I will need to make sure it's setup right

These things are pretty standard, and should work out of the box:

* 4GB of DD4 SDRAM (expandable, 2 slots, up to 32GB)
* 1TB SATA 5400RPM harddrive
* SATA DVD-Writer

### upgrades

I immediately upgraded RAM (to 20GB with a 16GB chip) and SSD (Crucial MX300 275GB M.2 card) but I left the old harddrive in there, for easier dual-boot and for extra storage. These 2 upgrades increase the performance immediately, and don't require me to pull anything out, so I get immediate value without loss. They also should be fine with hackintosh, as long as SSD is working ok.

## bootdisk

We're going to make a bootable USB drive to install. Load up the app store, and install Sierra. Hit `⌘-Q` to exit installer once it runs, but the files will still be on your hardrive!

### usb installer

Go to Disk Utility, under Applications/Utilities, right-click on the drive, choose "Erase", choose GPT and journaled MacOS (the defaults.)

![hackintosh installer drive settings](/files/hackdrive.jpg)

Next, run [Pandora's Box](http://www.insanelymac.com/forum/files/file/11-pandoras-box-os-x-installer/) to add the bootloader and drivers to a USB thumbdrive. Make sure it's at least 8GB (I used a reliable 32GB thumby I had around.) Check "createinstallmedia" and use all defaults.

![pandora settings](/files/pandora.jpg)

It takes a while. Try what I did: drink cheap beer and dance around to [The Humanoid Problem](https://open.spotify.com/album/0QTPof5SZfzFcpBSCGpRLc) like a <s>weirdo</s> boss.

When it finally finishes, slam your Coors down and click "Install Clover" button.

Pandora makes it easy to do the clover `efi` part, as you just choose stuff in the simple, albeit confusing, interface.

I chose "Yes" for laptop support, I left all the efi drivers as-is. I chose the `(laptop's) config_HD615_620_630_640_650.plist` because that's what I have. click "Install", Bam!

Once it's all done, copy Pandora's Box app onto the Installer partition on the USB (not "EFI") and copy any drivers you know for sure you will need.

## collecting drivers

`kext` files (located in `EFI/CLOVER/kexts/Other`) are the low-level drivers for things in OSX, and `efi` files (in `EFI/CLOVER/drivers/64UEFI`) are lower-level drivers for the EFI bootloader (Clover.) I want the only modifications to OSX to be on EFI partition for easier management and better backups and upgrades.

[this guide](https://www.tonymacx86.com/threads/guide-booting-the-os-x-installer-on-laptops-with-clover.148093/) is awesome and has a lot of info pertaining directly to the process we are doing here. Also, [this](https://www.tonymacx86.com/threads/faq-read-first-laptop-frequent-questions.164990/) was useful.


### wifi

I found [this](https://www.tonymacx86.com/threads/compatibility-wifi-atheros-ar5b195-on-yosemite.156527/) which recommends [toledaARPT.kext](https://www.tonymacx86.com/threads/guide-airport-pcie-half-mini-v2.104850/) with [this firmware upgrade](https://github.com/RehabMan/OS-X-Atheros-3k-Firmware) to enable bluetooth.

## boot that shit

I needed to go into the BIOS (`F2`) and disable secure boot, which you can only do if you set an Admin Password on my laptop.

It boots into OSX-install or it gets the hose again.

![hose time](/files/hose.jpg)

First time I booted, I got just the apple logo and frozen boot. I restarted, hit space on the mac icon, chose "Verbose" and booted again, and just got a bunch of pluses.

![laptop hose](/files/pluses.jpg)

I looked around, and this hard-to-troubleshoot-no-error-message situation is probably caused by basic required boot harddrive or CPU efi's. I copied [OsxAptioFixDrv-64.efi](https://github.com/MegaCookie/Lenovo-Y580-OSX-Installer-Clover/blob/master/Clover%20UEFI/EFI/CLOVER/drivers64UEFI/OsxAptioFixDrv-64.efi) and [HFSPlus.efi](https://github.com/JrCs/CloverGrowerPro/blob/master/Files/HFSPlus/X64/HFSPlus.efi?raw=true) into `EFI/Clover/drivers64UEFI/`, rebooted (with verbose enabled) and got into installer!

Once I was in the Installer screen, I went to "Disk Utility" and Erased my SSD (GPT, journaled, like when I made the USB) and proceeded through install.

I rebooted, using clover on the USB, and got to my desktop after a series of invasive opt-in scenarios, provided thoughtfully by Apple.

When it came back up, the video seemed a bit slow, and I noticed scrolling doesn't work on the trackpad.

I ran Pandora's Box, and did "Bootloaders configurator" and setup clover with boot rc-scripts. It didn't want to boot, so I used Pandora's EFI mount to copy the files from the EFI on the USB to the harddrive.

## tuning drivers for hardware

* I copied [toledaARPT.kext](https://github.com/toleda/wireless_half-mini/tree/master/Deprecated%20Files/airport_kext_enabler) in `EFI/CLOVER/kexts/Other` to get wifi working.
