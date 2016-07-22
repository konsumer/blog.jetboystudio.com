---
title:  "Cool SSH Trick"
date:   2013-05-14 16:07:00
tags: [EC2, AWS, Ubuntu, quickie, SSH]
---

I have a generic disposable SSH keypair for working on projects on AWS.  I like to not have to remember dumb details (especially when I'm drunk.)

---

Here is how to only have to type `ssh HOST` and have it use the right key with all new Ubuntu instances I spin-up. Make a file called `~/.ssh/config` that looks like this:

    Host *.compute.amazonaws.com
        User ubuntu
        IdentityFile ~/.ssh/deploy.key

Save a key named "deploy" in `~/.ssh/deploy.key` and it will automatically use that, and "ubuntu" username.

If you need to generate a pubkey (like for a github project deploy key, etc) Use this command:

`ssh-keygen -y -f ~/.ssh/deploy.key`