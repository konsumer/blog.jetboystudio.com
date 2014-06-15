---
template: article.html
title:  "Daydrunk Hipsters Rejoice"
date:   2014-06-14 19:57:00
tags: [brunch, quickie]
---

So, lately I have been super-into [brunch](http://brunch.io). Less configuration, same amount of power as [grunt](http://gruntjs.com/) or [gulp](http://gulpjs.com/). It does efficient streaming builds like [gulp](http://gulpjs.com/), so it's faster than [grunt](http://gruntjs.com/), but so much simpler to use than the rest! It's been a while since I had enough time to write a blog post, so I thought I should maybe talk about my new infatuation.

I made a [quick start skeleton](https://github.com/konsumer/brunch-daydrunk) that uses all kinds of cool things to make projects very quickly.

Let's make an app that includes authentication, registration, and a few pages.

```
brunch new gh:konsumer/brunch-daydrunk killa
cd killa
heroku create
heroku addons:add mailgun
heroku addons:add mongolab
heroku config:pull --overwrite
```

So, now we have email service, a database, and an app all ready to get started with. It's all free & awesome. Let's fire up a local dev server that compiles our LESS & concats our javascript, so we can flesh out our app.

```
npm start
```

Ok, so go edit stuff. Whatever you do in `front/` will get built into `generated/`.

Step 1 is to remove the junk from `front/assets/partials/index.html`.  Make a nice welcome page. Add any angular stuff you need in `front/js/controllers/index.js`, and main.js is the parent-scope, if you need to share something between controllers.

Let's add some cool pages at `#/hello` & `#/ohai`. Add templates to `front/assets/partials/`. Since they all basically do the same thing, we can just assign them to the same controller in `front/js/site.js`. Make your route config look like this:

```javascript
.config(function($routeProvider) {
    $routeProvider

    .when('/', {
        templateUrl: 'partials/index.html',
        controller: 'IndexCtrl'
    })

    .when('/hello', {
        templateUrl: 'partials/hello.html',
        controller: 'IndexCtrl'
    })

    .when('/ohai', {
        templateUrl: 'partials/ohai.html',
        controller: 'IndexCtrl'
    })

    .otherwise({
        redirectTo: '/'
    });
})
```

Ok, cool. When you are ready to deploy do a `git add -A && git commit -am "deploy" && git push heroku master`

This is a super-basic overview. Hopefully, I'll have time to write more, soon.