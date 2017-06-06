---
title: Hackintosh Laptop
date: 2017-05-06T13:00:00.000Z
tags:
  - mac
  - hackintosh
path: /articles/hackintosh2/
---

I realized [this article](/articles/hackintosh/) about my hackintosh desktop isn't super-detailed, and I thought I would go into it more with my new Acer Aspire E5-575 laptop.

The desktop was fairly straightforward. I used the easy [Multibeast & Unibeast](https://www.tonymacx86.com/resources/categories/tonymacx86-downloads.3/) to quickly get setup, and it mostly worked perfectly with Sierra, out of the box. I [recently heard](http://prasys.info/2011/01/tonymac-seriously/) that tonymacx86 hasn't given proper credit for the awesome work that other developers have put in to make hackintoshing work so well, and I am interested in going a bit deeper with my laptop because I can tell already I am going to need to do put in more manual work (Unibeast didn't boot, and it appears I need special drivers and things.) Also, I want the only modifications to OSX to be on EFI partition for easier management and better backups and upgrades.

## hardware

It's not cutting-edge or fancy, but I liked the Aspire E5-575-33BM for the price (under $400), the look (all black, macpro-ish keyboard/trackpad), 12hour battery-life, and my initial research says I should be able to hackintosh it. If not, it'll make a fine Linux laptop for a good price, so I won't be heartbroken.

The main elements of the hardware are:

* Intel Core™ i3-7100U dual-core 64bit Kabylake
* 4GB of DD4 SDRAM (expandable, 2 slots, up to 32GB)
* Intel HD integrated Graphics 620
* Qualcomm Atheros NFA435A wifi. Often hackintoshing doesn't work with integrated cards found in laptops, so I am open to getting a cheap replacement, if necessary.
* 1TB SATA 5400RPM harddrive
* SATA DVD-Writer

I immediately upgraded RAM (to 20GB with a 16GB chip) and SSD (Crucial MX300 275GB M.2 card) but I left the old harddrive in there, so I can dual-boot and for extra storage. These 2 upgrades increase the performance immediately, and don't require me to pull anything out, so I get immediate value without loss. They also should be fine with hackintosh.

## collecting drivers

`kext` files are the low-level drivers for things in OSX, and `efi` files are drivers for the bootloader (in my case I'd like to use clover.)

### wifi

I found [this](https://www.tonymacx86.com/threads/compatibility-wifi-atheros-ar5b195-on-yosemite.156527/) which recommends [toledaARPT.kext](https://www.tonymacx86.com/threads/guide-airport-pcie-half-mini-v2.104850/) with [this firmware upgrade](https://github.com/RehabMan/OS-X-Atheros-3k-Firmware) to enable bluetooth.
