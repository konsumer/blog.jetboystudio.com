---
title: Hackintosh Laptop
date: 2017-05-06T13:00:00.000Z
tags:
  - mac
  - hackintosh
path: /articles/hackintosh2/
---

I realized [this article](/articles/hackintosh/) about my hackintosh desktop isn't super-detailed, and I thought I would go into more detail about installing OSX Sierra (10.12) with my new Acer Aspire E5-575 laptop.

Basically, there are 2 factions of hackintosh forums/developers: [tonymacx68](https://www.tonymacx86.com) and [insanelymac](http://www.insanelymac.com). I [recently read](http://prasys.info/2011/01/tonymac-seriously/) that tonymacx86 hasn't given proper credit for the awesome work that other developers (who mostly hangout on insanelymac) have put in to make hackintoshing work so well. [Multibeast & Unibeast](https://www.tonymacx86.com/resources/categories/tonymacx86-downloads.3/) is what I have used in the past, and it was really easy, but [Pandora's Box](http://www.insanelymac.com/forum/files/file/11-pandoras-box-os-x-installer/) looks like it offers more control and also seems pretty easy, so I'll try that.

## hardware

It's not cutting-edge or fancy hardware by any means, but I liked the Aspire E5-575-33BM for the price (under $400), the look (all black, but sorta macpro-ish keyboard/trackpad), 12hour battery-life, and my initial research says I should be able to hackintosh it. If not, it'll make a fine Linux laptop for a good price, so I won't be heartbroken.

The main elements of the hardware are:

* Intel Core™ i3-7100U dual-core 64bit Kabylake
* Intel HD integrated Graphics 620
* Qualcomm Atheros NFA435A wifi. Often hackintoshing doesn't work with integrated wifi cards found in laptops, so I am prepared to get a new card, if needed
* Power Management - this often doesn't work on laptops, and can be tricky to troubleshoot, so I will need to make sure it's setup right

These things are pretty standard, and should work out of the box:

* 4GB of DD4 SDRAM (expandable, 2 slots, up to 32GB)
* 1TB SATA 5400RPM harddrive
* SATA DVD-Writer

### upgrades

I immediately upgraded RAM (to 20GB with a 16GB chip) and SSD (Crucial MX300 275GB M.2 card) but I left the old harddrive in there, so I can dual-boot and for extra storage. These 2 upgrades increase the performance immediately, and don't require me to pull anything out, so I get immediate value without loss. They also should be fine with hackintosh, as long as SSD is working ok.

## bootdisk

First, I setup the hardrive. Then I ran [Pandora's Box](http://www.insanelymac.com/forum/files/file/11-pandoras-box-os-x-installer/) to add the bootloader and drivers to a 32GB USB thumbdrive.

## collecting drivers

`kext` files (located in `EFI/CLOVER/kexts/Other`) are the low-level drivers for things in OSX, and `efi` files (in `EFI/CLOVER/`) are lower-level drivers for the EFI bootloader (in my case I'd like to use clover.) I want the only modifications to OSX to be on EFI partition for easier management and better backups and upgrades.

### wifi

I found [this](https://www.tonymacx86.com/threads/compatibility-wifi-atheros-ar5b195-on-yosemite.156527/) which recommends [toledaARPT.kext](https://www.tonymacx86.com/threads/guide-airport-pcie-half-mini-v2.104850/) with [this firmware upgrade](https://github.com/RehabMan/OS-X-Atheros-3k-Firmware) to enable bluetooth.
