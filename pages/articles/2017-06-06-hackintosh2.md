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
* Qualcomm Atheros NFA435A wifi. I hear hackintoshing often doesn't work with integrated wifi cards found in laptops, so I am prepared to get a new card, if needed
* Sound - I always have trouble with sound. It tends to be a trial-and-error situation with various drivers. I'll try voodoo first, which is a generic sort of catch-all.
* Ethernet - Not sure what ethernet chipset I have. I think it's a Realtek from what I can find online.

These things are pretty standard, and should work out of the box:

* 4GB of DD4 SDRAM (expandable, 2 slots, up to 32GB)
* 1TB SATA 5400RPM harddrive
* SATA DVD-Writer
* Camera - these usually just work, unless they are interfaced in some weird way
* Trackpad - I'm hoping this goes ok, should look like a regular mouse.
* Power Management - I'm hoping this works ok.

### upgrades

I immediately upgraded RAM (to 20GB with a 16GB chip) and SSD (Crucial MX300 275GB M.2 card) but I left the old harddrive in there, for easier dual-boot and for extra storage. These 2 upgrades increase the performance immediately, and don't require me to pull anything out, so I get immediate value without loss. They also should be fine with hackintosh, as long as SSD is working ok.

I installed the latest BIOS from the Acer site, before doing anything.

## bootdisk

We're going to make a bootable USB drive to install. Load up the app store, and purchase/install Sierra. Hit `⌘-Q` to exit installer once it runs, but the files will still be on your hardrive!

### usb installer

Go to Disk Utility, under Applications/Utilities, right-click on the drive, choose "Erase", choose GPT and journaled MacOS (the defaults.)

![hackintosh installer drive settings](/files/hackdrive.jpg)

Next, run [Pandora's Box](http://www.insanelymac.com/forum/files/file/11-pandoras-box-os-x-installer/) to add the bootloader and drivers to a USB thumbdrive. Make sure it's at least 8GB (I used a reliable 32GB thumby I had around.) Check "createinstallmedia" and use all defaults.

![pandora settings](/files/pandora.jpg)

It takes a while. Try what I did: drink cheap beer and dance around to [The Humanoid Problem](https://open.spotify.com/album/0QTPof5SZfzFcpBSCGpRLc) like a <s>weirdo</s> boss.

When it finally finishes, slam your Coors down and click "Install Clover" button.

Pandora makes it easy to do the clover `efi` part, as you just choose stuff in the simple, albeit confusing, interface.

I chose "Yes" for laptop support, I left all the efi drivers as-is. I chose the `(laptop's) config_HD615_620_630_640_650.plist` because that's what I have. click "Install", Bam!

## collecting drivers

`kext` files (located in `EFI/CLOVER/kexts/Other`) are the low-level drivers for things in OSX, and `efi` files (in `EFI/CLOVER/drivers/64UEFI`) are lower-level drivers for the EFI bootloader (Clover.) I want the only modifications to OSX to be on EFI partition for easier management and better backups and upgrades.

[this guide](https://www.tonymacx86.com/threads/guide-booting-the-os-x-installer-on-laptops-with-clover.148093/) is awesome and has a lot of info pertaining directly to the process we are doing here. Also, [this](https://www.tonymacx86.com/threads/faq-read-first-laptop-frequent-questions.164990/) was useful.

I put these on the disk for later:

* [DPCIManager](https://sourceforge.net/projects/dpcimanager/) for detecting devices
* [Pandora's Box](http://www.insanelymac.com/forum/files/file/11-pandoras-box-os-x-installer/) for post-install stuff
* [Kext Wizard](http://www.insanelymac.com/forum/topic/253395-kext-wizard-easy-to-use-kext-installer-and-more/)
* [Clover Configurator (vibrant edition)](http://mackie100projects.altervista.org/download-clover-configurator/)


## boot that shit

I needed to go into the BIOS (`F2`) and disable secure boot, which you can only do if you set an Admin Password, on my laptop. Yours may differ. Basically, with hackintosh, in your BIOS, you want EFI booting off SATA, and everything else pretty much default.

It boots into OSX-install or it gets the hose again.

![hose time](/files/hose.jpg)

First time I booted, I got just the apple logo and frozen boot. I restarted, hit space on the mac icon, chose "Verbose" and booted again, and just got a bunch of pluses.

![laptop hose](/files/pluses.jpg)

I looked around, and this hard-to-troubleshoot-no-error-message situation is probably caused by basic required boot harddrive or CPU efi files. I copied [OsxAptioFixDrv-64.efi](https://github.com/MegaCookie/Lenovo-Y580-OSX-Installer-Clover/blob/master/Clover%20UEFI/EFI/CLOVER/drivers64UEFI/OsxAptioFixDrv-64.efi) and [HFSPlus.efi](https://github.com/JrCs/CloverGrowerPro/blob/master/Files/HFSPlus/X64/HFSPlus.efi?raw=true) into `EFI/Clover/drivers64UEFI/`, rebooted (with verbose enabled) and got into installer!

Once I was in the Installer screen, I went to "Disk Utility" and Erased my SSD (GPT, journaled, like when I made the USB) and proceeded through install.

## post-installation

I rebooted, using clover on the USB, and got to my desktop after a series of invasive opt-in scenarios, provided thoughtfully by Apple.

I ran Pandora's Box, and did "Bootloaders configurator" and setup clover with boot rc-scripts. It didn't want to reboot, so I used Clover Configurator's EFI mount to copy the files from the EFI on the USB to the harddrive, which got it booting without the USB.

Make a time-machine backup, if you have the space. This is "totally vanilla + USB clover EFI, boots but not much else". You can use this with the installer to get back to this stage quickly, if you screw things up. It takes a long time, but it will save you time and stress in the future.


### fix broken things

At this point go through and try to figure out what doesn't work, so we can form a strategy for setting up drivers.

To identify chipsets, I'm going to use [DPCIManager](https://sourceforge.net/projects/dpcimanager/). I put it on the thumbdrive, and installed it on the hackintosh.

I also went to [olarila](http://olarila.com/kexts/) and downloaded the Mac OSX system Info Util. It requires java, so you'll need an internet connection to download the "Legacy JRE", and it didn't seem to give me any info that DPCIManager gave me, so YMMV.

Under Pandora's "post installation" I went through several screens and picked out appropriate drivers for everything, as best as I could guess from PCI info in DPCIManager. I listed what I did, below. It took lots of reboots and trial-and-error.

> I installed everything I could to the "Other" of the EFI partition, rather than the system folders.

#### sensors

I checked everything in "kazlek HWSensor 6.25.1426" in Pandora's post-installation to get some sensor capabilities.

After a reboot, I had advanced sensors in Applications/Utilities/HWMonitor. I have it running on startup so I have a ncie way to look in on all my hardware.


#### disk

I enabled "TRIM Enabler", "AHCIPortInjector.kext" and "AppleATIATA.kext"

After reboot, I found "TRIM Enabler" in Applications/Utilities and enabled patch. I rebooted, then ran it again, and verified that TRIM is enabled.


#### bluetooth

This worked right away. Not sure why, but I'll take it. You can verify this in "System Preferences/Bluetooth".


#### ethernet

DPCIManager says it's a RTL811/8168/8411 (`0x10EC:0x1025 0x8168:0x1094`)

I installed RealTekRTL8111.kext in Pandora's post-installation. It worked after reboot. I used this to install other drivers and get things working.

#### power management

This didn't work on boot: no battery indicator.

I enabled "ACPIBatteryManager.kext" (under laptop in Pandora's post-installation) which got this working.


#### sound

Sound didn't work. You can verify this in "System Preferences/Sound" and you'll see the outputs are not there.

I started to install Voodoo under Pandora's "post installation" to get it working. In the install panel it says "ALC255" which DPCIManager [verifies](https://github.com/shmilee/T450-Hackintosh/blob/master/ALC3232/tools/patch-hda-codecs.pl#L40) (codec id: `0x10EC0255`.) The "Mirone AppleHDA" drivers had ALC255 listed under "Laptop's", but I wasn't sure how to use it (so confusing!) I just went for Voodoo, works fine.


#### graphics

It works at boot, at the monitor's max-resolution, but definitely not accelerated.


I got the graphics to work by adding [FakePCIID_Intel_HD_Graphics.kext and FakePCIID.kext](https://bitbucket.org/RehabMan/os-x-fake-pci-id/downloads/) to /EFI/CLOVER/kexts/Other

Next, I looked through config.plist for `#AddProperties` and changed it to `AddProperties` then added this in the `<dict>` below that:

```plist
  <key>Device</key>
  <string>IntelGFX</string>

  <key>Key</key>
  <string>AAPL,GfxYTile</string>

  <key>Value</key>
  <data>AQAAAA==</data>
```

When I rebooted, it worked great.


#### trackpad

It works as a mouse, but scrolling doesn't work on the trackpad.


#### wifi

I tried WifiInjector.kext in Pandora's post-installation, but it didn't seem to work.

I found [this](https://www.tonymacx86.com/threads/compatibility-wifi-atheros-ar5b195-on-yosemite.156527/) which recommends [toledaARPT.kext](https://www.tonymacx86.com/threads/guide-airport-pcie-half-mini-v2.104850/) with [this firmware upgrade](https://github.com/RehabMan/OS-X-Atheros-3k-Firmware) to enable bluetooth, but as I said it seems to already work.

The directions were super-confusing to me, and although I tried to get it to work by patching things in clover, I ended up using [Kext Wizard](http://www.insanelymac.com/forum/topic/253395-kext-wizard-easy-to-use-kext-installer-and-more/) to install it on my system. That still didn't work.

I installed an [alternative kext](https://bitbucket.org/RehabMan/os-x-atheros-3k-firmware/downloads/) in EFI/CLOVER/kexts/Other, but that didn't work either.

I was at my end, then I found [some FakePCIID stuff](https://github.com/RehabMan/OS-X-Fake-PCI-ID). I still couldn't make it work. This the last of the important stuff (I can live with the trackpad not scrolling) so I will update when I get it working or just get a new card.


## conclusion

I actually like this method a lot better than unibeast+multibeast. I will probably use it instead, in the future, even for non-laptops. It should be more resistant to updates & easier to backup than adding files to the system dirs. It seems easier to see how it all goes together, and will be easier to make changes to. I love that Pandora is an all-in-one solution, and is fairly easy to use, but I still think the interface could be improved a bit. I wish the source was available, so I could make it better.
