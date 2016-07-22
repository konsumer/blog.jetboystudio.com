---
title: Virtualbox Networking
date: 2013-07-17T08:48:00.000Z
tags:
  - quickie
  - VirtualBox
  - LAMP
  - networking
path: /articles/virtualbox-networking/
---

Virtualbox networking can be tricky.

---

[Earlier](/articles/easy-dev-environment/) I talked about setting up a VirtualBox machine for LAMP development.  It's a great way to keep your ideas/experiments fairly atomic, and not effect your regular system.  On my Hackintosh, sometimes my network drivers are not 100%, because they are really just fooling the OS into working.  I noticed after a recent update that Virtualbox bridged networking would make the whole network stack stop working, and I couldn't get to my Virtual Machines, or even to the internet from the host after starting a machine.  Here is how I fixed it, and made it a bit more robust, for the future.

## 2 Networks

We are going to make an internal host-only net, for serving up stuff just to the host, and an external net so the vmachine can get to the internet.

In VirtualBox, go to Virtualbox/Preferences, then Network.  Make a host-only network. Mine was called "vboxnet0".

On your virtual machine, under Network, set Adapter 1 to "Host-only Adapter".

Under Adapter 2, set it to "NAT". For both, under Advanced, set it to "Intel PRO/1000 MT Desktop" and set promiscuous mode to "DENY".

Start up the machine.

type `sudo lshw -C network | grep logical` to get the 2 device names (in my case: eth2 & eth3.)

type `sudo vim /etc/network/interfaces` and replace my devices, with whatever you got from above:

    # local-only vbox net
    auto eth3
    iface eth3 inet dhcp

    # NAT net
    auto eth2
    iface eth2 inet dhcp

## Testing and Usage

Restart the vmachine.

type `ping google.com` from vmachine to test if it can get to the internet.

Type `ifconfig` to get the IP address that were assigned to each interface. On mine, the local interface (eth3) had an IP of 192.168.56.101, and a NAT'ed (eth2) address of 10.0.3.15. On your host, go add the internal address to `/etc/hosts` so you can call the machine by name:

    # vhosts served by VirtualBox
    192.168.56.101 project1.local project1
    192.168.56.101 project2.local project2
    192.168.56.101 project3.local project3

If you setup everything else, as [I did](/articles/easy-dev-environment/) you should have files in ~/Sites/project1/webroot on host machine that gets served-up, and you should be able to `ping 192.168.56.101` from the host.
    

