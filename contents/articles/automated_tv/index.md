---
template: article.html
title:  "Automating TV torrent downloads"
date:   2013-04-15 19:05:00
tags: [torrent,NAS,TV,quickie]
---

I want [Stooge, my NAS](/articles/nas/) to be able to keep track of my favorite shows, and download new episodes when they come out.

---

I made [TV Party](https://github.com/konsumer/tvparty) to do this exactly how I want, which is to say: no frills, simple REST API, easy to work with, and no dependencies other than node & npm-installed libs.

## Installing/Configuring Stuff

Make sure you [update node](http://blog.jetboystudio.com/2013/02/03/update-node.html). After that, do this:

```bash

sudo -s
git clone https://github.com/konsumer/tvparty.git /usr/local/share/tvparty && cd /usr/local/share/tvparty && npm install

```

### bam!

Now, make `/usr/local/share/tvparty/conf/settings.json` look like this:

```json

{
    "username": "USER",
    "password": "PASSWORD",
    "host": "192.168.1.5",
    "port": "9091",
    "updateTime": 15,
    "serve_port": 3000,
    "add_dir":"/share/video/series"
}

```

Run `node app.js` and you can visit `http://localhost:{SERVE_PORT}/` to mess with your subscriptions.

### booyah!

Now, we want this to run when Stooge starts up. He is running Ubuntu Server 12.10. Let's copy `tvparty.init.sh` to `/etc/init.d/tvparty`. Now, add it to default start/stop: `update-rc.d tvparty defaults`


### wow!
