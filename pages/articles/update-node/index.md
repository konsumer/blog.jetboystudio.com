---
title:  "updated node.js on Ubuntu"
date:   2013-02-03 20:58:00
tags: [Ubuntu,Linux,node,quickie]
---

I was having funny little issues on Ubuntu 12.10 64bit, and realized that it was using a really old version of node.

---

I installed a new one like this:

```bash
sudo apt-get install python-software-properties software-properties-common python-software-properties
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install python g++ make nodejs npm
```