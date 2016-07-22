---
title: Music player in Angular.js
date: 2013-11-30T14:52:00.000Z
tags:
  - Angular
  - music
  - mp3
  - yeoman
  - yo
  - modular
  - components
  - echonest
path: /articles/angular-music-player/
---

Here I will teach you to make an Angular app that plays music, with reusable components that are packaged in single directories.  This will allow you to use the same audio controller in multiple apps, even if ou aren't paying attention (drunk.)

---

This is a complete client-side app.

## Application Design

The basic idea is that we have an file store of our MP3 files, and a JSON file with music data in it.

I want a player that features a scrolling list of album-covers, and let's you hit next or play button. I generated my data from echonest. Eventually, this could come from a REST API, or rdio, or something, but for now, let's keep it simple.

I want to make a player component, that listens for events, triggers play/pause, and has a player UI.  This will allow me to use the player in other applications. I want all the files for this component to be in `app/scripts/components/audioPlayer/`, so that I can simply drag&drop it into new projects.

To get started fast, I am just going to use bootstrap stuff for UI, which will make it easy to customize the UI, later, but look pretty good, by default.

Feel free to organize your files in whatever way makes sense. If you don't care about components being lil plugins, put them in scripts/styles/etc.

You may also want to use an [audio element fallback](http://mediaelementjs.com/).

## Yo!

I am using yeoman to get started fast. The angular-generator includes bootstrap boilerplate code and a quick start. I don't 100% agree with dude's choices, but I am a lazy man. You can use grunt to build a compiled version, run a static-webserver, run testing suite, and much more! You will need npm & node installed.


Install yo & the angular-generator with this:

```
sudo npm install -g yo generator-angular
```

###  Make a new project

```
mkdir music_player
cd music_player
yo angular
```

Answer yes, no, then enter. (use bootstrap, no scss, install all angular components)

Now, start your local server with `grunt serve`. You should see a cute bootstrap page with Mr Yeoman saying "Allo".

Any changes we make to the app will trigger a refresh. Sweet!

I'm not using bootstrap's javascript or jQuery, but it's required by this generator to not get ugly errors in teh console:

```
bower install --save sass-bootstrap
```

There is probably a better angular-generator, but I ain't got time for nothing but the basics, gangster rap & drinking cheap beer.


## Component

Components are basically "extend HTML to have this new element that does all this cool shit I thought of." We are going to make one called `<audio-player>` that enables an app to have a cute lil playlist-player.

Make `app/scripts/components/audioPlayer/` look like this:

*component.js*

```js
angular.module('audioPlayer-directive', [])
  .directive('audioPlayer', function($rootScope) {
    return {
      restrict: 'E',
      scope: {},
      controller: function($scope, $element) {
        $scope.audio = new Audio();
        $scope.currentNum = 0;

        // tell others to give me my prev/next track (with audio.set message)
        $scope.next = function(){ $rootScope.$broadcast('audio.next'); };
        $scope.prev = function(){ $rootScope.$broadcast('audio.prev'); };

        // tell audio element to play/pause, you can also use $scope.audio.play() or $scope.audio.pause();
        $scope.playpause = function(){ var a = $scope.audio.paused ? $scope.audio.play() : $scope.audio.pause(); };

        // listen for audio-element events, and broadcast stuff
        $scope.audio.addEventListener('play', function(){ $rootScope.$broadcast('audio.play', this); });
        $scope.audio.addEventListener('pause', function(){ $rootScope.$broadcast('audio.pause', this); });
        $scope.audio.addEventListener('timeupdate', function(){ $rootScope.$broadcast('audio.time', this); });
        $scope.audio.addEventListener('ended', function(){ $rootScope.$broadcast('audio.ended', this); $scope.next(); });

        // set track & play it
        $rootScope.$on('audio.set', function(r, file, info, currentNum, totalNum){
          var playing = !$scope.audio.paused;
          $scope.audio.src = file;
          var a = playing ? $scope.audio.play() : $scope.audio.pause();
          $scope.info = info;
          $scope.currentNum = currentNum;
          $scope.totalNum = totalNum;
        });

        // update display of things - makes time-scrub work
        setInterval(function(){ $scope.$apply(); }, 500);
      },

      templateUrl: '/scripts/components/audioPlayer/views/component.html'
    };
  });
```

This gives our app an `<audio-player>` tag that does the following:

*  generate an audio element.
*  has next/prev/playpause/play/pause exposed in `$scope` of component
*  broadcasts lots of messages on `$rootScope` for other controllers/components to respond to and tell this component what to play
*  responds to `audio.set` broadcasts on `$rootScope` to set the current audio file
*  jump to next song when a track finishes

*views/component.html*

```html
<div class="form-group">
  <label>volume: <input min="0" max="1" step="0.01" type="range" ng-model="audio.volume" /></label>
</div>

<div class="form-group">
  <button ng-disabled="currentNum == 0" class="btn btn-default prev" ng-click="prev()"><i class="glyphicon glyphicon-step-backward"></i> prev</button>
  <button class="btn btn-default playpause" ng-click="playpause()" ng-class="{paused:audio.paused}">
    <span class="play-text"><i class="glyphicon glyphicon-play"></i> play</span>
    <span class="pause-text"><i class="glyphicon glyphicon-pause"></i> pause</span>
  </button>
  <button ng-disabled="currentNum >= (totalNum-1)" class="btn btn-default next" ng-click="next()">next <i class="glyphicon glyphicon-step-forward"></i></button>
</div>

<div class="form-group time">
  <label>time: <input min="0" max="{{audio.duration}}" step="0.01" type="range" ng-model="audio.currentTime" /></label>
</div>

<div class="form-group now-playing">
  <p>Now Playing: <img width="30" height="30" src="{{info.image}}" /></p>
  <p>{{info.artist.name}} - {{info.title}}</p>
</div>


```

This gives us a prev/play&pause/next button, a volume control, a time-indicator/scrubber, and track-info. It's all updated automatically when things change with the underlying audio element!

*component.css*

```css
/* minimal CSS to get started with component. feel free to override in main.css */
audio-player .paused .play-text,
audio-player .pause-text {
  display:inline-block;
}
audio-player .play-text,
audio-player .paused .pause-text {
  display:none;
}
audio-player * {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

This makes our play/pause button swap out the text & icon correctly, using the `.paused` class & disables user-select inside audio-player, so the buttons won't trigger selection.

## Using our new awesome

So, now we need to add stuff to our index.html & main controller. Look for the build comments in `app/index.html`, and make the CSS one look like this:

```html
<!-- build:css({.tmp,app}) styles/main.css -->
<link rel="stylesheet" href="styles/bootstrap.css">
<link rel="stylesheet" href="scripts/components/audioPlayer/component.css">
<link rel="stylesheet" href="styles/main.css">
<!-- endbuild -->
```

and find the JS module build stanza near the bottom, and make it look like this:

```html
<!-- build:js scripts/modules.js -->
<script src="bower_components/angular-resource/angular-resource.js"></script>
<script src="bower_components/angular-cookies/angular-cookies.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
<script src="bower_components/angular-route/angular-route.js"></script>
<script src="scripts/components/audioPlayer/component.js"></script>
<!-- endbuild -->
```

This adds our CSS & javascript to the resources-tree. Next, we need to inform our app that it should use this new directive. edit `app/scripts/app.js` to look like this:

```js
'use strict';

angular.module('musicPlayerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'audioPlayer-directive'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
```

I had some MP3 files in `app/mp3/`, and ran the [echoprint tool](https://github.com/echonest/echoprint-codegen) on them. First I installed that in my path, then wrote a [lil node script](https://github.com/konsumer/music_player/tree/master/fingerprinter) (total overkill, related to a project) to do the work of making the list, which gets saved in `app/data/music.json`.

The data I am using is formatted like this:

```json
[
  {
  "title": "SONG TITLE",
  "artist": {"name": ARTIST NAME"},
  "image": "ALBUM COVER",
  "file": "MP3 FILE" // without location name
  }
]
```

You will need to generate/create this file in `app/data/music.json`, and it needs to represent your music collection.

This, of course, should probably later come from a local REST service (couchdb has this built in!) that does the work of tracking your collection, or whatever.

### Listing albums

In order to list albums, the basic idea is that we have a list of tracks, and we will show a window of records. In order to do this, we add a startFrom filter (limitTo already exists.) Our controller also needs to load the list of tracks and tell our new audio-player what the current file is and respond to prev/next broadcasts.  Here is how I modified my main controller (in `app/scripts/controllers/main.js`):

```js
'use strict';

angular.module('musicPlayerApp')
  .filter('startFrom', function() {
    return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
    };
  })
  
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.currentTrack = 0;
    $scope.pageSize = 5;
    $scope.data=[];

    var updateTrack = function(){
      $rootScope.$broadcast('audio.set', 'mp3/' + $scope.data[$scope.currentTrack].file, $scope.data[$scope.currentTrack], $scope.currentTrack, $scope.data.length);
    };

    $rootScope.$on('audio.next', function(){
      $scope.currentTrack++;
      if ($scope.currentTrack < $scope.data.length){
        updateTrack();
      }else{
        $scope.currentTrack=$scope.data.length-1;
      }
    });

    $rootScope.$on('audio.prev', function(){
      $scope.currentTrack--;
      if ($scope.currentTrack >= 0){
        updateTrack();
      }else{
        $scope.currentTrack = 0;
      }
    });

    $http.get('data/music.json')
      .success(function(response){
        $scope.data = response;
        updateTrack();
      });
  });

```

Modify your `app/views/main.html` to show the data-window as a ng-repeat & use the new audio-player:

```html
<header class="jumbotron">
  <h1>'Allo, 'Allo!</h1>
  <p class="lead">
  <img src="images/yeoman.png" alt="I'm Yeoman"><br>
  Here is your sweet-ass audio player: <br>
  <audio-player></audio-player>
  </p>
</header>

<ul class="albums">
  <li
  ng-repeat="item in data | startFrom:currentTrack | limitTo:pageSize"
  ng-style="{'background-image':'url({{item.image}})'}"
  title="{{item.artist.name}} - {{item.title}}"
  data-file="{{item.file}}"
  ></li>
</ul>

<footer class="footer">
  <p>&hearts; from your super-bud <a href="https://github.com/konsumer">konsumer</a></p>
</footer>
```

Last step: style the track images in `app/styles/main.css`:

```css
.albums {
  margin:0;
  padding:0;
}

.albums li {
  list-style:none;
  margin:10px;
  display:inline-block;
  width: 120px;
  height: 120px;
  background-color: #eee;
  background-size: cover;
  border: 1px solid #333;
}
```

Dang! Not too much work, for a pretty big payoff. Angular rocks.


