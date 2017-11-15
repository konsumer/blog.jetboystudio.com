---
title: Bootstrap tagging
date: 2013-11-12T00:01:00.000Z
tags:
  - quickie
  - tagging
  - bootstrap
  - node
  - express
  - mongoose
  - mongodb
contentType: blog
path: /articles/bootstrap-tagging/
---

I had a need for a mongodb-driven tagging widget. The idea is that you get nice tags that you can add & remove, and it knows about tags that are already present.

---

First, get some cheap beer, and a bottle of Amaretto. Alternate swigs, and read on.

I was haing a lot of trouble with various parts of this. I think I just needed a bit o' gangster-rap & Amaretto. Maybe with my help your roll will be smooth-sails.

Ok, so first I have a cute lil express.js app. I will detail the entire process.

Run `npm init` to create a new node package.json. Just answer the questions.

Run `npm install --save express && npm install --save mongoose` to add express & mongoose to your project.

You can head over to [mongolab](https://mongolab.com) to get a free mongodb, if you don't want to host it yourself.

make your server.js look like this:

```javascript
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    MyModel = require('./models/MyModel');

mongoose.connect(require('./config.json').database);

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use("/", express.static('public'));
    app.use(app.router);

    app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

// get a list of available tags
app.get('/d/tags', function(req, res){
    // you can put strings in here to preseed tags. slick!
    MyModel.find().distinct('tags', function(er, d){
    var out = ["hipster trash", "euro trash", "foolish whim", "good idea"];
        if (er) return res.send(500, er);
        res.send(out.concat(d));
    });
});

var port = require('./config.json').port || 8000;
console.log('come see us at http://0.0.0.0:' + port);

app.listen(port);
```

all the `app.configure` stuff is me getting fancy. Totally optional if you are running a static webserver somewhere else.

If you don't need to preseed your auto-complete list, make your callback look like this fancy (simple) bee-yute:

```javascript
// get a list of available tags
app.get('/d/tags', function(req, res){
    MyModel.find().distinct('tags', function(er, d){
        if (er) return res.send(500, er);
        res.send(d);
    });
});
```

There is also a config file called `config.json`:

```json
{
    "database": "mongodb://<dbuser>:<dbpassword>@<dbhost>:<dbport>/<dbname>"
}
```

Make sure to add that to .gitignore. Alternately, you can just fill in the mongo URI, above.


`MyModel` is an example model. Make sure it has a "tags" string-array field. Let's make a lil cutie in `models/MyModel.js` that looks kinda like this:

```javascript
var mongoose = require('mongoose');

var MyModel = new mongoose.Schema({
    "name": String,
    "description": String,
    "cool": Boolean,
    "tags": [String],

    "hipster.cool": Boolean,
    "hipster.ironic": Boolean,
    "hipster.poser": Boolean
});

module.exports = mongoose.model('MyModel', MyModel);
```

As a sidenote, I realized how to make models in mongoose have a nice Object structure, without pseudo-sub documents (extra ids & overhead.) All you gotta do is name fields things like `thing.field`. super-cool!


Make a lil dev script to insert a bunch of records, mine is silly, feel free to tailor to your own sweet-sweet model.

I am using my awesome [randopeep](https://github.com/konsumer/randopeep) lib. Install with `npm install --save-dev randopeep`

let's call this file `genenerate-hipsters.js` and run it with `node genenerate-hipsters.js`

```javascript
var mongoose = require('mongoose'),
    randopeep = require('randopeep');
    MyModel = require('./models/MyModel');

mongoose.connect(require('./config.json').database);

for (i=0; i<100; i++){
    var rec = {
        "name": randopeep.corporate.name('cyber'),
        "description": randopeep.corporate.catchPhrase(),
        "cool": Math.random() >= 0.5,
        "tags": [],
        "hipster":{
            "cool": Math.random() >= 0.5,
            "ironic": Math.random() >= 0.5,
            "poser": Math.random() >= 0.5
        }
    };

    rec.tags = rec.tags.concat(randopeep.invention(25));
    rec.tags = rec.tags.concat(randopeep.job(25));

    var s = new MyModel(rec);
    s.save();
    
    console.log(s);
}
```
This will generate 100 nice random MyModels, with 50 tags each.

OK! now, for the client-side code, put this in public/index.html like a champ:

```html
<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">
<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/tagmanager/3.0.0/tagmanager.css">
<link rel="stylesheet" href="https://raw.github.com/jharding/typeahead.js-bootstrap.css/master/typeahead.js-bootstrap.css">

<script src="http://codeorigin.jquery.com/jquery-1.10.2.min.js"></script>
<script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.9.3/typeahead.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/tagmanager/3.0.0/tagmanager.js"></script>

<div class="container">
    <form class="form-horizontal" role="form">
      <div class="form-group">
        <label for="tags">Tags:</label>
        <input type="text" class="form-control" id="tags">
      </div>
    </form>
</div>

<script>
var tagger = $('#tags').tagsManager();
$("#tags").typeahead({
    prefetch: '/d/tags'
}).on('typeahead:selected', function (e, d) {
    tagger.tagsManager("pushTag", d.value);
});
</script>
```

Run `npm start` and you will have a running webserver & JSON interface to your db's tags.

Now, yer all set. It still needs a little style love, but basically does what is needed. Pretty extreme level of magic for such a small investment, eh?




