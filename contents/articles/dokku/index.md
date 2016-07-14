---
template: article.html
title:  "Staging Server with Dokku"
date:   2016-06-30 17:12:49
tags: [React,digital ocean,heroku,node,quickie]
---

Here is how I setup my staging server to show clients progress.

It's been a really very long time since I wrote something. Sorry about that. Been super-busy drinking & coding!

## what are you trying to do?

I manage systems like this:

*  local development, tracked with git, current on master: run `npm start` for dev server
*  git push to staging (either master or a branch)
*  git push to production (either master or a branch)

I really like the ease of deploying to [heroku](https://www.heroku.com/), but thought I could run my own cheaper. I also want to be able to deploy [docker](https://www.docker.com/) apps.

## dokku

[dokku](https://github.com/dokku/dokku) lets you do all these things. I set mine up on [Digital Ocean](https://www.digitalocean.com/?refcode=333f9dfd59df&utm_campaign=Referral_Invite&utm_medium=Referral_Program) on the cheap (about $20 a month.) I use this to host all my staging sites.

### setting up the server

*  Go to [Digital Ocean](https://www.digitalocean.com/?refcode=333f9dfd59df&utm_campaign=Referral_Invite&utm_medium=Referral_Program) to setup an account (that link gives you $10 credit.)
*  Click "Create Droplet" and "One-click Apps" choose the $20/month size & "Dokku 0.6.2 on 14.04".
* Set your SSH key and hostname, click "Create"
* Once it spins up, add all your user's SSH public-keys with this command: `cat /path/to/public_key | ssh root@yourdokkuinstance "sudo sshcommand acl-add dokku [description]"`

### setup DNS

The IP of my Digial Ocean instance is `192.241.239.28`. I use enom for DNS. I setup a host record like this:

```
*  - A  -  192.241.239.28
```

This means "send everyone who asks for a domain that hasn't been accounted for to my digital oceon box."

I have the bare domain and www setup, so now I can make `http://whatever.jetboystudio.com`

### setup a project

We are going to make a simple lil mostly-static site that gives instructions, and let's users quickly send an email to me to add their key (with the above command.) I could make a fancy admin, but I just want it to be fast and simple. You can see what I did at [dev.jetboystudio.com](http://dev.jetboystudio.com/). For the sake of simplicity, I will just use my domain below, but you will need to change it to yours.

1. Get site with `git clone https://github.com/konsumer/dev.git && cd dev && npm i`
2. Run local with `npm start`
3. Put in your own name, email, and configure stuff. Make it useful to devs.
4. Add your staging server with `git remote add dokku dokku@dev.jetboystudio.com:dev`
5. Push with `git push dokku master`

Now the default is the info-site for deploying to dev. You can add a remote like `git remote add staging dokku@dev.jetboystudio.com:WHATEVER` to any project and it will be at `http://WHATEVER.jetboystudio.com`, and you can push with `git push staging master`.

#### notes

*  I am using a node-based static server. A proper nginx static server would probably be better, but ths was easier to setup
*  I used [auth0](https://auth0.com/) to provide auth for github (so people can get a list of their public keys really quickly)
*  [Here](https://github.com/konsumer/dev) is the code.
