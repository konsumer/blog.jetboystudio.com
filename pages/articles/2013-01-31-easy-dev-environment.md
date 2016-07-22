---
title: 'Easy dev environment, on any computer'
date: 2013-01-31T23:02:00.000Z
tags:
  - Drupal
  - LAMP
  - drunk
  - Linux
  - PHP
  - MySQL
  - Apache
  - development
  - VirtualBox
readNext: /articles/tools
path: /articles/easy-dev-environment/
---

If you are like me, you want a full LAMP stack on your box while developing, and don't want it to mess with your other stuff.

---

*  WAMP & MAMP are ok, I guess, but tend to have little oddities that make them act funny/broken, or they mess with other system files, which I hate. Linux is pretty light, in a vbox totally self-contained, and is a real version of what you  will eventually be deploying on (Linux rules!)
*  I wanna slick-ass setup, that requires no config for new projects (drunken dev-site-launches, lets go!)
*  I don't want to have to SSH into my local vhost, I just wanna make web-stuff and have it work without thought.
*  I want to do this all while drunk. If I get wasted in the process, and it fails, then it is too complicated for the inexperienced, when I haven't had my coffee in the morning, or when I am (as now) wasted.  This is unacceptable. We are rarely at 100%.

I am running Mac Mountain Lion 10.8.2 on a Hackintosh. These directions should apply to any host OS, including Linux Windows, and Mac. My Hackintosh is a tricky little power-beast, but you don't really need all that.  Any system that can run VirtualBox and blast tunes should be A-OK.

I start drinking a gross amount of Hamms (the beer-refreshing) and set out on my noble mission.

Whatever you see in () is what I am blasting on my stereo or doing, for some context. You can safely ignore.

In all directions, replace "konsumer" with your local username.

## The (simple) grimy details

*  (Combichrist - Tractor) Install [Virtualbox](https://www.virtualbox.org/wiki/Downloads)
*  Download an [Ubuntu Server Disk Image](http://www.ubuntu.com/download/server): takes half an hour (make a few cocktails!)
*  Wait. Drink. Dance around your room/office. (mixes by @Glucosemusic on soundcloud, bumped up for extra glitchy bass-madness)
*  Dang! It's done, finally. Contemplate the nature of data and it's real-world toll on all of our souls. Bits are tangible, yo.
*  (masterful digi-funk hits by DOS.putin on soundcloud) Run VirtualBox (left window open while I danced) make a new virtual-machine. It's Linux, Ubuntu 64bit. I named mine "LAMPinatro", which is how I apparently type "LAMPinator" when I am wasted. Make sure it has the recommended RAM (I gave mine 2048MB, because I already love it like the father I never had)
*  Right-click on "LAMPinatro" and go to settings. Under "Network" set it to "Bridged". Under "Shared Folders" add your home directory (on my hackmac: /User/konsumer) and set it to "Auto-mount" (chug a Hamms: the beer refreshing, Hamms)
*  Run it. It will ask for a bootdisk, choose the Ubuntu ISO image you downloaded already (mmm, cocktails....)
*  (Suicide Commando is so good...) Hit ENTER a bunch, enter your name, etc. I set host name to "lampinator", typed correctly this time!
*  Hit ENTER till it asks if you want to write to disk, choose YES, hit ENTER, like a boss.
*  Wait for all the pretty red progress-bars to, like blood, slowly tick away the pointlessness of your life.
*  Set updates to "Install security updates automatically"
*  In the tasksel menu, choose "OpenSSH Server, and LAMP server", TAB, ENTER.
*  (Velvet Acid Christ) Enter passwords for MySQL
*  Hit ENTER till it reboots (check facebook while banging head)
*  (Ramstein - Sonne) I like to use my sweet Mac transparent-background terminal (that can easily cut/paste), so I use ssh to setup initial stuff.  login to your vmachine, type `ifconfig` to get the IP. In my case it was `192.168.1.130`. In terminal ssh: `ssh konsumer@192.168.1.130`
*  (wumpscut - praise your fears) `sudo apt-get update && sudo apt-get install virtualbox-guest-utils phpmyadmin drush`, password, ENTER, wait... autoconfigure for apache.
*  (Combichrist - Never Surrender) `sudo vim /etc/apache2/sites-available/vhosts`, hit "I" make it like this:
    
```apache
<VirtualHost *:80>
  EnableSendFile Off
  UseCanonicalName off
  VirtualDocumentRoot /media/sf_konsumer/Sites/%1/webroot

  CustomLog "/media/sf_konsumer/Sites/logs/access_log" combined
  ErrorLog "/media/sf_konsumer/Sites/logs/error_log"
 
  <Directory "/media/sf_konsumer/Sites/*"> 
    AllowOverride All
    Options Indexes FollowSymLinks MultiViews
    RewriteEngine On 
    RewriteBase / 
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !=/favicon.ico
    RewriteRule ^/media/sf_konsumer/Sites/(.*)$ index.php/$1 [QSA,L]
 
    # Rules to correctly serve gzip compressed CSS and JS files.
    # Requires both mod_rewrite and mod_headers to be enabled.
    <IfModule mod_headers.c>
      # Serve gzip compressed CSS files if they exist and the client accepts gzip.
      RewriteCond %{HTTP:Accept-encoding} gzip
      RewriteCond %{REQUEST_FILENAME}\.gz -s
      RewriteRule ^(.*)\.css $1\.css\.gz [QSA]
 
      # Serve gzip compressed JS files if they exist and the client accepts gzip.
      RewriteCond %{HTTP:Accept-encoding} gzip
      RewriteCond %{REQUEST_FILENAME}\.gz -s
      RewriteRule ^(.*)\.js $1\.js\.gz [QSA]
 
      # Serve correct content types, and prevent mod_deflate double gzip.
      RewriteRule \.css\.gz$ - [T=text/css,E=no-gzip:1]
      RewriteRule \.js\.gz$ - [T=text/javascript,E=no-gzip:1]
 
      <FilesMatch "(\.js\.gz|\.css\.gz)$">
        # Serve correct encoding type.
        Header set Content-Encoding gzip
        # Force proxies to cache gzipped & non-gzipped css/js files separately.
        Header append Vary Accept-Encoding
      </FilesMatch>
    </IfModule>
 
    # Requires mod_expires to be enabled.
    <IfModule mod_expires.c>
      # Enable expirations.
      ExpiresActive On
 
      # Cache all files for 2 weeks after access (A).
      ExpiresDefault A1209600
 
      <FilesMatch \.php$>
        # Do not allow PHP scripts to be cached unless they explicitly send cache
        # headers themselves. Otherwise all scripts would have to overwrite the
        # headers set by mod_expires if they want another caching behavior. This may
        # fail if an error occurs early in the bootstrap process, and it may cause
        # problems if a non-Drupal PHP file is installed in a subdirectory.
        ExpiresActive Off
      </FilesMatch>
    </IfModule>
 
    # PHP 5, Apache 1 and 2.
    <IfModule mod_php5.c>
      php_flag magic_quotes_gpc                 off
      php_flag magic_quotes_sybase              off
      php_flag register_globals                 off
      php_flag session.auto_start               off
      php_value mbstring.http_input             pass
      php_value mbstring.http_output            pass
      php_flag mbstring.encoding_translation    off
    </IfModule>
  </Directory> 

  Alias /phpmyadmin/ "/usr/share/phpmyadmin/"
  <Directory "/usr/share/phpmyadmin/">
      Options Indexes MultiViews FollowSymLinks
      AllowOverride None
      Order deny,allow
      Allow from all
  </Directory>

 
  LogLevel debug 
</VirtualHost>
```

I keep my files in Mac `~/Sites/ohcool/webroot`, when I want them to work for http://ohcool.local. adjust the above if you don't do that.

ESC:wq Gosh!, we win!

Now, do this:

```bash
sudo adduser www-data konsumer
sudo adduser www-data vboxsf
sudo adduser konsumer www-data
sudo adduser konsumer vboxsf
```

*  `sudo a2enmod vhost_alias rewrite && sudo a2dissite default && sudo a2ensite vhosts`
*  (Funker Vogt)  `sudo reboot` I am the prince of evil. I don't work at Dairy Queen.
*  Your vbox is pretty much as it will be, for the rest of your pro-life. awesome.
*  (Covenant: eins, zwei, drei, FEAR! - Dead stars) On your host system, you can install [dnsmasq](http://www.davesouth.org/stories/how-to-set-up-dnsmasq-on-snow-leopard-for-local-wildcard-domains), but I prefer to just add stuff to /etc/hosts. I added this:

```
192.168.1.114 test test.local
```

*  in SSH (or direct) type `mkdir -p /media/sf_konsumer/Sites/test/webroot`
*  `echo "o cool" > /media/sf_konsumer/Sites/test/webroot/index.html`
*  `mkdir -p /media/sf_konsumer/Sites/logs`
*  `sudo service apache2 restart` for good measure. check errors. all cool?
*  visit http://test.local
*  enjoy what yer new website has to say about you.

Now, life is better, here's why:

*  (Tragic Error - Tanzen) you can drop yer random code-thoughts in ~/Sites/SITE/webroot and profit, like you meant it
*  you can use http://SITE.local/phpmyadmin to mess with DB
*  you can see yer logs in ~/Sites/logs/, for those hard-to-drunken-troubleshoot typa issues.
*  you have a lot more time for beer, and it won't [trash your Minecraft saves](http://www.youtube.com/watch?v=BfHpMaAVp-I), I promise. (Betcha didn't know I had a sword in my pants...)

Now, when you wanna test something, fire up your fancy-ass vmachine (takes like 2 secs, fer reals) and hit the site.local. You can SSH in and drush-up your Drupal things, if you want, and be done with that mess (corrugated piece of sh*t...)

I gotta get some sleep, with all this Hamms I been drinking.

If you are looking for explanations of the above, here goes:

*  It's "Bridged" networking, so you can get to the IP of it from your host system. NAT makes it get the Internet, but no access from host. We expect more from our playthings.
*  I auto-mount it, and setup virtualbox in client so I can share my files easy.  I point Apache to use ~/Sites as my vhost root. virtualbox take scare of permissions, like it's a network mount. I add apache user to vboxsf so I can just do stuff how I like, and not be bothered with pesky details, like dumbass permissions or whatevs. It's local, security is stupid.
*  I like vim, use whatever you like, nano is super-simple. Both are pre-installed in Ubuntu Server 12.
*  This kinda drunken-ease comes from master-level know-how. Be sure to look into all the technology we talk about here, to get a better idea of how things really work, and how to make it work better. I expect you to return with a tech-battle and avenge this drunken blog post.

Nigh-night, ninjas


