var wintersmith = require('wintersmith');
var env = wintersmith('config.json');

var path=require('path')
	fs = require('fs');

// do something with the content tree
env.load(function(error, result) {
  if (error) throw error;
  for(f in result.contents.articles){
  	var article = result.contents.articles[f]['index.md'];
  	var links=article.markdown.match(/\[(.+)\]\((.+)\)/g);
  	if (links){
	  	links.forEach(function(l){
	  		if (l.split('(').pop()[0] == '/'){
	  			// it's self-referential
	  			if (l.split('(').pop().indexOf('/files') !== -1){
	  				// it's a file, copy it to article dir
	  				var fname = l.split('(/files/').pop().split(')').shift();
	  				console.log(f, l);
	  				// fs.createReadStream(path.join('/Users/konsumer/Desktop/blog/blog_new/contents/files/', fname)).pipe(fs.createWriteStream(path.join('contents/articles/', f, fname)));
	  			}else{
	  				// it's an article, get new link
	  				console.log('article', f , l);
	  			}
	  		}
	  	});
	  }
  }
});