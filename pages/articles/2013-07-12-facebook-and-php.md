---
title: 'Facebook PHP kinda sucks, here''s how to make it better'
date: 2013-07-13T03:15:00.000Z
tags:
  - facebook
  - PHP
  - composer
path: /articles/facebook-and-php/
---

Deving for Facebook apps kinda sucks using server-side PHP. PHP's lib is not 100% with all browsers and has lil glitches if you don't do it right, and you gotta really pay attention to a lot of details if you need info from the parent page.

---

I was making a Facebook app that was consumed by many branded retailers, and they all gotta have the right logos, etc.  I wanted 1 codebase & facebook tab-app to serve up an app for everyone, and not cause me too much grief. The methodology I am describing is not what I went with, for fear of missing deadlines, but is how you should do it, if you can, and have control from the start.

This post will also explain, in detail, how to setup a nice & neat [composer](http://getcomposer.org/) app, that uses [mustache](https://packagist.org/packages/mustache/mustache) for views, and is fairly maintainable.

## The PHP lib is not in sync with the JS

The first thing you gotta know, if you need info about what page is calling the app and you support IE, is that no one is your friend. You are in a dark and lonely place where Facebook says "seriously dudes, that's just dumb" to the lone way that IE can do cross-iframe communication. You gotta double-up on cookies & go crazy with the session for anything to persist. Yer gonna have to get yer hands filthy with javascript, so get ready. Your only sword in this masochistic and ill-planned D&D game is to do as much as possible client-side.  Let Facebook's javascript API handle all the details, and just pass it to your lil PHP friend, in the back, when you need to save stuff. Facebook's Javascript can do all but know about the page calling you. It can handle users, do graph lookups (if you know the name, find out more.)


### Setup your app with composer

I like [composer](http://getcomposer.org/). It makes dev'ing framework-less PHP apps a breeze, and if planned correctly, it can help you organize your app, as if you are using a framework.  PHP class auto-loading is cool, and keeps your code neat.  Go install it in your path. Make a file called `composer.json` that looks like this:

**composer.json**

```json
{
    "require": {
        "facebook/php-sdk": "dev-master"
    },
    "autoload": {
        "classmap": [
            "app"
        ]
    }
}
```

This means "this app requires the dev version of facebook-sdk" and "autoload my own app's classes from app/ folder"

Make a folder called `app/` and a folder called `webroot/`.  Point your webserver to `webroot` (see [here](/articles/easy-dev-environment/) for this all done automatically on a virtual machine.)

Now, run `composer install`.

Anytime you change files in `app/` or dependencies, run `composer update`. I like to put this in git-hooks and git-ignore `vendor/` & `composer.lock`, so I don't have to bother with it.

### Routing

Think of `webroot/index.php` as a basic router and loader of other classes.  Try and put as much functionality as possible into the classes defined in `app/`, rather than the `index.php` file.  If your facebook app has only 1 entry point, then you don't need an actual URL router, but if you have any links (AJAX, GET, POST) you may want to install a proper URL router.  I recommend [ToroPHP](https://packagist.org/packages/torophp/torophp), so make your composer.json file look like this:

**composer.json**

```json
{
    "require": {
        "torophp/torophp": "dev-master",
        "facebook/php-sdk": "dev-master"
    },
    "autoload": {
        "classmap": [
            "app"
        ]
    }
}
```

For Toro clean-urls, I added this:

**webroot/.htaccess**

```apache
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond $1 !^(index\.php)
RewriteRule ^(.*)$ /index.php/$1 [L]
```

Go to Facebook, and [make your "Page Tab" app](https://developers.facebook.com/apps).

Set the "Page Tab URL" to whatever URL resolves to your app's webroot.

**For all PHP code examples, below, leave off the `?>` on the end. I just add it for syntax-highlighting to work, and a space after it is hard to find, and will mess with header stuff.**

I made a `config.php` file, outside of the webroot, to handle all configuration.  Mine looks like this, but you could definately do something fancier with a class/database/etc:


**config.php**

```php
<?php

// DEV: output ALL errors to screen
error_reporting(E_ALL);
ini_set('display_errors', 1);

// set timezone for all date functions
date_default_timezone_set('America/Los_Angeles');

$config = array();

$config['title'] = "My Cool Facebook App";

$config['view_dir'] = __DIR__ . "/views/";

// Facebook App info for tab-app
$config['facebook'] = array(
    'appId'=>'BADWOLFBADWOLFBADWOLF',
    'secret'=>'BADWOLFBADWOLFBADWOLF'
);

?>
```

Replace Doctor Who reference with your credentials. Put whatever else site-specific config you need in there.

**webroot/index.php**

```php
<?php
require dirname(__DIR__) . '/config.php';
require dirname(__DIR__) . '/vendor/autoload.php';
session_start();

// save any info we get about app/auth from facebook
$facebook = new Facebook($config['facebook']);
$sr = $facebook->getSignedRequest();
if (!empty($sr)){
    $_SESSION['signed_request'] = $sr;
}

// here you could verify $_SESSION['signed_request']['page']['id'] is authorized to use this tab, if you wanted.

ToroHook::add("404",  function() {
    header('HTTP/1.0 404 Not Found');
    $controller = new BaseController();
    echo $controller->view("404", array('title'=>'Not Found'));
});

Toro::serve(array(
    "/" => "Home"
));


?>
```

Now, go make a `app/Home.php`. The method `get()` will handle GET requests to "/". I like using a template-lib like [mustache](https://packagist.org/packages/mustache/mustache) and a BaseController class that all my controller extend that is smart enough to do 90% of the work. If you want to go that direction, add `"mustache/mustache": "*"` to your composer.json's `require` section. I will show a quick example, but how you actually implement your app is obviously totally up to you. Above, in the 404 function, I am using BaseController, which I will define, below.

The facebook stuff is just to save any incoming facebook info, if there is some.

**app/BaseController.php**

```php
<?php

class BaseController {
    public function view($tpl, $context=array(), $layout="layout", $name=NULL){
        global $config;
        static $mustache;
        
        if (empty($mustache)){
            $mustache = new Mustache_Engine(array(
                'cache' => sys_get_temp_dir () . '/cache/mustache/' . $_SERVER['SERVER_NAME'],
                'cache_file_mode' => 0666, // Please, configure your umask instead of doing this :)
                'loader' => new Mustache_Loader_FilesystemLoader($config['view_dir']),
                'partials_loader' => new Mustache_Loader_FilesystemLoader($config['view_dir']),
                'helpers' => array(),
                'escape' => function($value) {
                    return htmlspecialchars($value, ENT_COMPAT, 'UTF-8');
                },
                'charset' => 'UTF-8',
                'logger' => new Mustache_Logger_StreamLogger('php://stderr'),
                'strict_callables' => true,
            ));
        }
        
        $context['title'] = empty($context['title']) ? $config['title'] : $context['title'] . ' - ' . $config['title'];
        $context['config'] = $config;
        $context['request'] = $_REQUEST;
        $context['server'] = $_SERVER;
        $context['session'] = $_SESSION;
        $context['template'] = empty($name) ? $tpl : $name;
        
        if (!empty($layout)){
            $context['content'] = $mustache->render($tpl, $context);
            $out = $mustache->render($layout, $context);
        }else{
            $out = $mustache->render($tpl, $context);
        }
        
        return $out;
    }
    
    // generic views
    function get(){
        echo $this->view($this->template, array('title'=>$this->page_title));
    }
    function get_xhr(){
        header("Content-Type:text/html");
        echo '<div class="xhr">'.$this->view($this->template, array(), NULL).'</div>';
    }
}

?>
```

**app/Home.php**

```php
<?php

class Home extends BaseController {
    public $template = "home";
    public $page_title = NULL;
}

?>
```

Ok, so we have a generic BaseController, that does Mustache, we have 2 generic methods: `get` & `get_xhr` which just serve up the view, with or without a layout, we have a Home controller, and we have a 404 error handler. Since you made changes to the classes, don't forget to run `composer update`.

Again, this is just an example, but for all this to work as it is, `views/` holds Mustache templates, and include `layout.mustache`, `404.mustache`, and `home.mustache`. Go make those. Mine look like this:


**views/layout.mustache**

```html
<!DOCTYPE html>
<html lang="en" class="no-js" data-app="{{config.facebook.appId}}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <title>{{title}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Your name here>
    <script src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js"></script>
    <link href="/css/site.css" rel="stylesheet">
    {{#session.signed_request.page.id}}
        <script>window.page={ id: "{{session.signed_request.page.id}}", liked: {{session.signed_request.page.liked}}, admin: {{session.signed_request.page.admin}} };</script>
    {{/session.signed_request.page.id}}
  </head>
  <body class="page-{{template}}">
    <div id="wrapper">
      <header><h1>{{config.title}}</h1></header>
      <section class="clearfix">{{{content}}}</section>
      <footer>&copy; 2013 {{config.title}}</footer>
    </div>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="/js/site.js"></script>
  </body>
</html>
```

**views/404.mustache**

```html
<h2>Page not found</h2>
```

**views/home.mustache**

```html
<h2>Welcome</h2>
```


The `{{#session.signed_request.page.id}}` bit in the header tells the client-side javascript about the page that called it. The `{{config.facebook.appId}}` part is the facebook app id of your tab-app.


So, now is the part where you start work on the client-side javascript we talked about earlier.  How you do this totally depends on how your app works, but for illustration, here is mine:

**webroot/js/site.js**

```javascript
// immediate fangate, if you setup the CSS
if (window.page && window.page.liked){
    document.getElementsByTagName('body')[0].attributes['class'].value+=" liked";
}

if (window === window.top){
    console.log('not in an iframe, not on facebook.');
}else{
    console.log('in an iframe');
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : document.getElementsByTagName('html')[0].attributes['data-app'].value,
        channelUrl : '//' + document.location.host + document.location.pathname + '/channel.php',
        status     : true,
        cookie     : true,
        xfbml      : true
    });
    function login(){
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('logged in');
                FB.api('/me', function(user){
                    facebook_authorized(user, FB, response);                
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
                login();
            }
        },{scope: 'email'});
    }

    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.api('/me', function(user){
                facebook_authorized(user, FB, response);
            });
        } else if (response.status === 'not_authorized') {
            login();
        } else {
            login();
        }
    });
};

// callback for Facebook correctly authorized
function facebook_authorized(user, FB, auth){
    FB.Canvas.setSize();
    FB.Canvas.setAutoGrow();
    
    console.log('FB', FB);
    console.log('user', user);
    console.log('auth', auth);

    // do your stuff here.
    // you have window.page, user, FB, and the auth objects to do things
    // make sure to verify them, and do cool stuff
}


(function(d, s, id){
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) {return;}
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/all.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
```

This will add "liked" to body class, so you can hide stuff by default and show it under body.liked in CSS, for a fangate. You can see how I detect if I'm in an iframe, do what you want if not.  `facebook_authorized()` is your entry-point, and has access to all the data you will need.

The way this is all setup, you can get just the content on the server by sending ajax requests to routes, so that might be good for things like this:

```javascript
$.get('/about', function(content){
    $('section').html(content);
});
```

and make a route in `index.php` like this:

```php
    <?php
    
    Toro::serve(array(
        "/" => "Home",
        "/about" => "About"
    ));
    
    ?>
```

and **app/About.php**

```php
    <?php

    class About extends BaseController {
        public $template = "about";
        public $page_title = "About Us";
    }

    ?>
```

and **views/about.mustache**

```html
    <h1>o hai!</h1>
```


