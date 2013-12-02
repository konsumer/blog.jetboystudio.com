---
template: article.html
title:  "How to quickly fix a mis-named user"
date:   2013-02-06 21:55:00
tags: [drunk, Ubuntu, Linux, quickie]
---

Recently, I was setting up an Ubuntu VirtualMachine, and drukenly mistyped the primary username.

This is pretty easy to fix very quickly, thought I would share.

---

First, boot GRUB into recovery-mode, and choose root-shell from menu.

We need to find out what I drunkenly typed, and fix it by moving the user to what I meant.

```
mount -o rw,remount /
cat /etc/passwd
```

At the end, I saw `"konsmuer:x:1000:1000:David Konsumer,,,:/home/konsmuer:/bin/bash"`

`konsmuer` should be `konsumer`. Oh dear!

At this point, I can pretend I am French (pronounced "kon sew mway"), and just leave it. Now that I know how it's spelled, I could login with my new name, or I can fix it. I think you know what I did next.

Now for the fancy replacement:

```
cd /etc
# gives list of files to change - check these
grep -R konsmuer

# do change, automatically
for i in `grep -R konsmuer -l .`; do
    sed -i 's/konsmuer/konsumer/g' $i
done
```

This means "find all files that have 'konsmuer', and in-place modify them with sed using a search/replace for 'konsumer'".

If you messed up typing the password too, type this:

```
passwd konsumer
```

Lastly, let's move yer home dir:

```
mv /home/konsmuer /home/konsumer
```

Now, reboot, and you can login with your corrected user.
