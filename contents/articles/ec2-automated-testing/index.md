---
template: article.html
title:  "Automated Clustered Load Testing with EC2 & node"
date:   2013-05-10 14:42:00
tags: [ EC2, AWS, Ubuntu, load, testing, quickie ]
---

I made a simple little clustered testing system, using [NodeStressSuite](https://github.com/Samuel29/NodeStressSuite). Basically, I want it to launch a bunch of instances, clobber a server, then remove all the machines.

--- 

This is all automated, so you just run the EC2-builder, and run it. This is basically a legit use of a DDOS botnet. Here is how I did it.

To get my loadtester, check out [the github page](https://github.com/konsumer/loadtester).

## Testing Framework

[NodeStressSuite](https://github.com/Samuel29/NodeStressSuite) is a still-developed version of [nodeload](https://github.com/benschmaus/nodeload). It's a lot like Apache's ab, but written in javascript, multi-suystem concurrent, and fancy! Be sure to go check it out to get an idea of the cool stuff you can do with it.

Here is how I added it to my project:

`npm install --save "git://github.com/Samuel29/NodeStressSuite.git#master"`

This will install nss.


### Modular tests

I want to be able to just plug-in a modular test, whenever I need to test something new.  I want to include all the options needed to test a server.  Here is the basic test I wrote, which includes all the options to stress-test http://jetboystudio.com. I save it as `jetboy.js`:

```javascript
// simple 3 minutes test

module.exports = {
    name: "jetboy",
    comment:"Simple load test for Jetboy Studio",
    host: 'www.jetboystudio.com',
    port: 80,
    timeLimit: 180,
    loadProfile: [[0,0], [180,400] ],
    stats: [
        'rps',
        'result-codes',
        {name: 'latency', percentiles: [0.95]},
        'concurrency',
        'request-bytes',
        'response-bytes'
    ],
    requestGenerator: function(client) {
        return client.request({method:'GET', path: '/'});
    }
};
```
This is a simple 3 minute stress test.
Your test will probably be a bit differnt, just have a look at [nss](https://github.com/Samuel29/NodeStressSuite) and my test for inspiration.

### Do some testing

Make `~/.aws` to look like this:

```json
{
    "key":"BADWOLFBADWOLFBADWOLFBADWOLF",
    "secret":"BADWOLFBADWOLFBADWOLFBADWOLFBADWOLFBADWOLF",
    "endpoint": "us-west-2"
}
```

Obviously, replace the Doctor Who reference with your AWS credentials, and set endpoint to your favorite zone (us-west-2: Portland, represent!) Make a keypair called `deploy` and create a security-group called `loadtest` that opens ports 22 (ssh) and 3000 (default test port.)

So, now that we have a test setup, let's spin-up a bunch of AWS instances to run it:

`loadtest --instances=5 jetboy.js`

This will turn on 5 AWS instances, and wait for them, then send the test. You can view the output at http://localhost:3000

To see your available options, run `loadtest --help`
