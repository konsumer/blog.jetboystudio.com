---
title: 'Manjaro Linux and PCI passthrough'
date: 2017-11-14T20:38:47Z
contentType: blog
path: /articles/manjaro/
tags:
  - linux
  - manjaro
  - arch
  - passthrough
---

## goals

* I want to isolate my OS config to highly performant virtual machines that I can save.
* I want to be able to quickly roll back to a specific config
* I want to isolate the OS of my "game machine" and "work machine" so I can just run them on the same hardware without them hurting each other.
* It's super-cool to have a functional OS running underneath the OS's I am interacting with. It provides a nice layer of live-debugging and recovery, and I can browse the web and play games while OS's install.

## hardware

In order to do passthrough, you need a full device to pass through (that isn't used on host system.) On mine, I am using the onboard video plugged into 1 monitor, and a Geforce 1060 plugged into another monitor.

* Nvidia GeForce GTX 1060 6GB
* Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz

You'll need a processor that has both VT-d an d VT-x.

## install manjaro

I wanted to start with a fresh Arch-based OS. [manjaro](https://manjaro.org/) is cool, as it has a graphical environment all setup to start. It's like what ubuntu is to debian, but arch-based. I ain't got time to futz with packages all day. I used the xfce variant, but all of them should be fine, so pick whatever sounds/looks good to you.

My thumb-drive is at `/dev/sdc` when plugged in (use `lsblk` to get a hint.) I downloaded the ISO, and got to work.

on my linux box, I typed this:

```
dd status=progress oflag=sync bs=4M if=~/Downloads/manjaro-xfce-18.0.3-stable-x86_64.iso of=/dev/sdc
```

I rebooted, and just used all the defaults and installed it to my first harddrive (500GB.) I opted for the full partition erase and a hibernate-swap.

## setting up hypervisor for passthrough

All my basic info came from [here](https://wiki.archlinux.org/index.php/PCI_passthrough_via_OVMF).

I'll just list what I did:

```
sudo -s
pacman -S  qemu libvirt ovmf virt-manager iptables ebtables dnsmasq spice-vdagent libvirt-python
nano /etc/default/grub
```

I installed [virsh-patcher](https://github.com/PassthroughPOST/virsh-patcher) to make the nvidia driver work an apply other patches to my machines, later.

```
pip install -U https://github.com/PassthroughPOST/virsh-patcher/archive/master.zip
```

I changed this line:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet resume=UUID=bef93fb7-18ba-466d-8e9c-2847867f0e35"
```

to this:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet resume=UUID=bef93fb7-18ba-466d-8e9c-2847867f0e35 intel_iommu=on iommu=pt"
```

(note the 2 things on end about `iommu`)

They talk about PCI IOMMU groups and ensuring that they are segmented ok [here](https://wiki.archlinux.org/index.php/PCI_passthrough_via_OVMF), but I am only passing through my video-card and the video-card's audio adapter (for HDMI) so I didn't really need to worry about it.

Next, I ran `lspci -nn` to get a list of PCI devices with their IDs.

```
00:00.0 Host bridge [0600]: Intel Corporation 8th Gen Core Processor Host Bridge/DRAM Registers [8086:3ec2] (rev 07)
00:01.0 PCI bridge [0604]: Intel Corporation Xeon E3-1200 v5/E3-1500 v5/6th Gen Core Processor PCIe Controller (x16) [8086:1901] (rev 07)
00:02.0 VGA compatible controller [0300]: Intel Corporation UHD Graphics 630 (Desktop) [8086:3e92]
00:12.0 Signal processing controller [1180]: Intel Corporation Cannon Lake PCH Thermal Controller [8086:a379] (rev 10)
00:14.0 USB controller [0c03]: Intel Corporation Cannon Lake PCH USB 3.1 xHCI Host Controller [8086:a36d] (rev 10)
00:14.2 RAM memory [0500]: Intel Corporation Cannon Lake PCH Shared SRAM [8086:a36f] (rev 10)
00:16.0 Communication controller [0780]: Intel Corporation Cannon Lake PCH HECI Controller [8086:a360] (rev 10)
00:17.0 RAID bus controller [0104]: Intel Corporation SATA Controller [RAID mode] [8086:2822] (rev 10)
00:1d.0 PCI bridge [0604]: Intel Corporation Cannon Lake PCH PCI Express Root Port #9 [8086:a330] (rev f0)
00:1d.3 PCI bridge [0604]: Intel Corporation Cannon Lake PCH PCI Express Root Port #12 [8086:a333] (rev f0)
00:1f.0 ISA bridge [0601]: Intel Corporation Device [8086:a308] (rev 10)
00:1f.3 Audio device [0403]: Intel Corporation Cannon Lake PCH cAVS [8086:a348] (rev 10)
00:1f.4 SMBus [0c05]: Intel Corporation Cannon Lake PCH SMBus Controller [8086:a323] (rev 10)
00:1f.5 Serial bus controller [0c80]: Intel Corporation Cannon Lake PCH SPI Controller [8086:a324] (rev 10)
00:1f.6 Ethernet controller [0200]: Intel Corporation Ethernet Connection (7) I219-V [8086:15bc] (rev 10)
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation GP106 [GeForce GTX 1060 6GB] [10de:1c03] (rev a1)
01:00.1 Audio device [0403]: NVIDIA Corporation GP106 High Definition Audio Controller [10de:10f1] (rev a1)
03:00.0 PCI bridge [0604]: Integrated Technology Express, Inc. IT8892E PCIe to PCI Bridge [1283:8892] (rev 71)
```

The important devices are `10de:1c03` (video) and `10de:10f1` (HDMI audio.)

```
sudo nano /etc/modprobe.d/vfio.conf
```

I made it look like this:

```
options vfio-pci ids=10de:1c03,10de:10f1
```

```
sudo nano /etc/mkinitcpio.conf
```

and I found the line that had `MODULES=""` and made it look like this:

```
MODULES=(vfio_pci vfio vfio_iommu_type1 vfio_virqfd)
```

Now, I setup libvert

```
sudo nano /etc/libvirt/qemu.conf
```

I added this:

```
nvram = [
	"/usr/share/ovmf/x64/OVMF_CODE.fd:/usr/share/ovmf/x64/OVMF_VARS.fd"
]
```

```
nano /etc/libvirt/libvirtd.conf
```

Uncomment the lines like this:

```
auth_unix_ro = "none"
auth_unix_rw = "none"
```

I need to setup internet forwarding:

```
sudo nano /etc/dnsmasq.conf
```

add this:

```
listen-address=127.0.0.1
```

My network device is `eno1`, so I also did this:

```
ip link set eno1 master virbr0
```

After this I ran this:

```

mkinitcpio -c /etc/mkinitcpio.conf -g /boot/initramfs-4.19-x86_64.img
update-grub
virsh net-autostart default
systemctl enable libvirtd dnsmasq
reboot
```

### verifying stuff

```
dmesg | grep -e DMAR -e IOMMU
```

I got this:

```
[    0.007234] ACPI: DMAR 0x0000000079554280 0000A8 (v01 ALASKA A M I    00000002      01000013)
[    0.170952] DMAR: IOMMU enabled
[    0.259963] DMAR: Host address width 39
[    0.259964] DMAR: DRHD base: 0x000000fed90000 flags: 0x0
[    0.259967] DMAR: dmar0: reg_base_addr fed90000 ver 1:0 cap 1c0000c40660462 ecap 19e2ff0505e
[    0.259968] DMAR: DRHD base: 0x000000fed91000 flags: 0x1
[    0.259970] DMAR: dmar1: reg_base_addr fed91000 ver 1:0 cap d2008c40660462 ecap f050da
[    0.259970] DMAR: RMRR base: 0x000000799d4000 end: 0x00000079c1dfff
[    0.259971] DMAR: RMRR base: 0x0000007b000000 end: 0x0000007f7fffff
[    0.259972] DMAR-IR: IOAPIC id 2 under DRHD base  0xfed91000 IOMMU 1
[    0.259972] DMAR-IR: HPET id 0 under DRHD base 0xfed91000
[    0.259973] DMAR-IR: Queued invalidation will be enabled to support x2apic and Intr-remapping.
[    0.263088] DMAR-IR: Enabled IRQ remapping in x2apic mode
[    1.714782] DMAR: No ATSR found
[    1.714813] DMAR: dmar0: Using Queued invalidation
[    1.714878] DMAR: dmar1: Using Queued invalidation
[    1.715118] DMAR: Hardware identity mapping for device 0000:00:00.0
[    1.715119] DMAR: Hardware identity mapping for device 0000:00:01.0
[    1.715185] DMAR: Hardware identity mapping for device 0000:00:02.0
[    1.715187] DMAR: Hardware identity mapping for device 0000:00:12.0
[    1.715188] DMAR: Hardware identity mapping for device 0000:00:14.0
[    1.715189] DMAR: Hardware identity mapping for device 0000:00:14.2
[    1.715190] DMAR: Hardware identity mapping for device 0000:00:16.0
[    1.715190] DMAR: Hardware identity mapping for device 0000:00:17.0
[    1.715191] DMAR: Hardware identity mapping for device 0000:00:1d.0
[    1.715192] DMAR: Hardware identity mapping for device 0000:00:1d.3
[    1.715193] DMAR: Hardware identity mapping for device 0000:00:1f.0
[    1.715193] DMAR: Hardware identity mapping for device 0000:00:1f.3
[    1.715194] DMAR: Hardware identity mapping for device 0000:00:1f.4
[    1.715195] DMAR: Hardware identity mapping for device 0000:00:1f.5
[    1.715196] DMAR: Hardware identity mapping for device 0000:00:1f.6
[    1.715198] DMAR: Hardware identity mapping for device 0000:01:00.0
[    1.715198] DMAR: Hardware identity mapping for device 0000:01:00.1
[    1.715199] DMAR: Setting RMRR:
[    1.715200] DMAR: Ignoring identity map for HW passthrough device 0000:00:02.0 [0x7b000000 - 0x7f7fffff]
[    1.715200] DMAR: Ignoring identity map for HW passthrough device 0000:00:14.0 [0x799d4000 - 0x79c1dfff]
[    1.715201] DMAR: Prepare 0-16MiB unity mapping for LPC
[    1.715201] DMAR: Ignoring identity map for HW passthrough device 0000:00:1f.0 [0x0 - 0xffffff]
[    1.715258] DMAR: Intel(R) Virtualization Technology for Directed I/O
```

Main thing is `DMAR: Hardware identity mapping for device` part, `Ignoring identity map for HW passthrough device` and `Intel(R) Virtualization Technology for Directed I/O`


```
lspci -nnk
```

You should see your devices listed with `vfio-pci`:

```
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation GP106 [GeForce GTX 1060 6GB] [10de:1c03] (rev a1)
	Subsystem: eVga.com. Corp. GP106 [GeForce GTX 1060 6GB] [3842:6163]
	Kernel driver in use: vfio-pci
	Kernel modules: nouveau
01:00.1 Audio device [0403]: NVIDIA Corporation GP106 High Definition Audio Controller [10de:10f1] (rev a1)
	Subsystem: eVga.com. Corp. GP106 High Definition Audio Controller [3842:6163]
	Kernel driver in use: vfio-pci
	Kernel modules: snd_hda_intel
```

```
cat /proc/cmdline
```

Look for `intel_iommu=on iommu=pt"`


If you can't verify all this, go back to the [awesome wiki](https://wiki.archlinux.org/index.php/PCI_passthrough_via_OVMF) and go back through the process.


## creating win10 virtual machine

Now, I'm going to create a Windows machine that uses passthrough.

```
virt-manager
```

Create a virtual machine, use the [Windows 10 64bit ISO](https://www.microsoft.com/en-us/software-download/windows10ISO).

Make sure to check `Customize configuration before install`

[IMAGE]

Set the Overview/Firmware to the OVMF UEFI listed & Chipset to Q35.

[IMAGE]

I made the CPU match my actual topology:

[IMAGE]

Single socket is needed so you can get multiple cores in Windows 10 Home.

and I setup PCI passthrough:

[IMAGE]

I booted it, and hit a key to boot from CDROM.

Once I got it all installed, I installed nvidia windows drivers, and I applied soem patches:

```
virshpatcher --error43 --host-passthrough win10
```

I also installed [spice guest tools](https://www.spice-space.org/download/binaries/spice-guest-tools/) to make integration with the spice interface work better.


## creating osx virtual machine

I also want to run OSX. I followed instructions [here](https://github.com/kholia/OSX-KVM) to get Mojave installed. I used `Mojave/create_iso_mojave.sh` to create the iso.
