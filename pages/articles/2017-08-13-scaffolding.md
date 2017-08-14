---
title: "JS project scaffolding"
date: 2018-08-13T20:12:00.000Z
tags:
  - node
  - react
  - development
  - tools
path: /articles/scaffolding/
---

This is an opinionated quickstart-quide for a couple types of projects. I use a mac for development, but the same basic procedures should apply in other environments. For all things, I prefer ES6, using npm scripts as build tools, and try to keep the number of files and depth of directories to a minimum, to help keep down cognitive load. Rather than just clone a ready-made starter project, which often gets stale fast, I am going to use tools we have available to get everything started, it also helps to explain each thing as we add it to our app, so we know what it's all for.

I'll try to break down the motivations of each project-type.

Before anything, let's get our scaffolding tools installed:

* Install the latest node/npm: `brew install node`
* Install [create-react-app](https://github.com/facebookincubator/create-react-app) and [getstorybook](https://github.com/storybooks/storybook/tree/master/lib/cli): `npm i -g create-react-app @storybook/cli`


## server/browser-side library, no react, published to npm

The basic idea is that we'll develop with unit-tests, and transpile when we push to npm. It must pass linting and tests before getting published.

```
mkdir PROJECT
cd PROJECT
npm init
npm i -D babel-cli babel-preset-env jest babel-jest standard
mkdir src
touch src/index.js src/index.test.js
```

Install any libraries you need with `npm i -S` to save them in your `package.json`.

make a section in `package.json` that looks like this:

```json

  "scripts": {
    "build": "babel src/index.js > index.js",
    "prepublish": "npm run lint npm run test && npm run build",
    "lint": "standard --fix",
    "test": "jest --notify --coverage",
    "test:watch": "jest --watch --notify --coverage"
  }

```

In the test-lines, add `--env=node` for projects that just run in node, and `--env=jsdom` for browser-based libraries that need the DOM.

also add this:

```json
  "babel": {
    "presets": ["env"]
  }
```

add these to your `.gitignore`:

```
node_modules
*.log
.DS_Store
coverage
index.js
```

make an `.npmignore` that looks same, but without `index.js`:

```
node_modules
*.log
.DS_Store
coverage
```

We ignore `index.js` in git, because it's the built-file that defines the npm-exported interface, which gets made when we publish to npm.

Lets start with an example `src/index.js`:

```js
import { readDirSync } from `fs`

/**
 * Dumb function to get all the files in a dir
 *
 * @param      {string}   dir The dir
 * @return     {string[]}     The files.
 */
export const getFiles = (dir = __dirname) => readDirSync(dir)
```

Export your interface via `export` statements, and optionally `export default`.

and our unit-test in `src/index.test.js`:

```js
/* global describe it expect */
import { getFiles } from './index'

describe('file utility thing', () => {
  it('should get files, server-side', () => {
    expect(getFiles()).toMatchSnapshot()
  })
})
```

[Jest](https://facebook.github.io/jest/) can handle async stuff with a `done` callback function (`(err, retval) => {}`) in `it()` or you can just return a `Promise`.

Alternately, you can also skip the `prepublish` build-step if you make a `index.js` that looks like this:

```js
require('babel-register')
module.exports = require('./src/index.js').default // or whatever your interface is
```

The downside is that you'll need to add `babel-register` to your project, and end-users will have to do a little more processing, and it will start up a bit slower, but maybe that's ok.

### releasing

When we are ready to publish, set the [semver](http://semver.org/) (follow the rules: is it a patch, minor, or major change?)

```
git init
git add -A
git commit -am "initial commit"
npm version patch
```

`npm version` will also tag your files in git to match the incremented version.

now, publish:

```
npm publish
```

This will trigger linting, testing, building, then send the version-tagged code to npm.

## only frontend

This is a frontend-focused project, that uses react & redux. It has a router & form redux store, and works with [redux devtools extension](https://github.com/zalmoxisus/redux-devtools-extension). This project is about a quick start. 0-to-developing as quickly as possible. You don't need to learn about [webpack](https://webpack.github.io/) (a big subject) or anything else to get going.

```
create-react-app PROJECT
cd PROJECT
getstorybook
npm i -S redux react-redux redux-form history react-router-redux@next
npm i -D standard
```

Add a line to your scripts in `package.json`:

```json
  "scripts": {
    "lint": "standard --fix",
  }
```

Now, you've got a bunch of tasks ready-made (run `npm run` for a list & checkout the generated `REAME.md` for more info.) If you're going to publish this on npm, you might want to follow the directions with `.npmignore` above, but in this case use `build/` as your output.

I like to setup storybook to auto-load the files, so I don't have to manually include them all (like the way jest picks up all the `*.test.js` files.)

```
mv stories/index.js src/demo.story.js
rmdir stories
```

Open up `.storybook/config.js`, and make it look like this:

```js
import { configure } from '@storybook/react'

// webpack trick to glob-require
const req = require.context('../src', true, /(\.story\.js$)|(\.story\.jsx$)/)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module)
```

Now, run `npm run storybook` to get a storybook, and make new `src/*.story.js` files to make stories of each of your components. Use `src/demo.story.js` as an example. When you have all your components built the way you like, you can incorporate them into your app, which starts at `src/index.js`.

### redux

The above process will get you set with [dumb component](https://jaketrent.com/post/smart-dumb-components-react/) development. Mostly, I work those out in storybook before I even start on my state & redux stores. Since forms are very state-driven, I save those for last, and use [redux-form](http://redux-form.com/) to manage them effortlessly in redux. Let's make a store that handles forms & routing, and our basic app.


`src/store.js`:

```js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { routerReducer as router, routerMiddleware } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import createHistory from 'history/createBrowserHistory'

export const history = createHistory()

export const reducer = (state = {}, action) => {
  switch (action.type) {
    default: return state
  }
}

const composeEnhancers = (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

export const store = createStore(
  combineReducers({
    app: reducer,
    router,
    form
  }),
  composeEnhancers(
    applyMiddleware(routerMiddleware(history))
  )
)

export default store
```

`src/index.js`:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'

import './index.css'

import registerServiceWorker from './registerServiceWorker'

import { history, store } from './store'

const Home = () => (<div>Home</div>)

const About = () => (<div>About</div>)

const AppHolder = ({children}) => (<div>
  <header><h1>HEADER</h1></header>
  <main>{children}</main>
  <footer>FOOTER</footer>
</div>)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppHolder>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
      </AppHolder>
    </ConnectedRouter>
  </Provider>, document.getElementById('root'))
registerServiceWorker()

```

Obviously, swap out `AppHolder`, `Home` and `About` for your own wrapper & page-level components.

### further reading

#### storybook

There are [tons of addons](https://storybook.js.org/addons/addon-gallery/). If you want to write stories for higher-level components that use redux, [you can](https://medium.com/@resol/redux-reactstorybook-d3cfebf2272a), but I try to avoid it if I can (and keep my components small and dumb, worry about state in unit-tests.)

#### async redux

One thing about redux is that all actions are synchronous. They shouldn't have side-effects, meaning they shouldn't trigger other actions, so without some utilities, things can get complicated and silly. To deal with this, read more about these different strategies, and see which feels the best:

* [redux-promise](https://github.com/acdlite/redux-promise) and [redux-actions](https://github.com/reduxactions/redux-actions) - simple actions that return promises and update store when they resolve
* [saga](https://github.com/redux-saga/redux-saga) - use [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) to perform async tasks that modify state
* [thunk](https://github.com/gaearon/redux-thunk) - return a function instead of an action, in an action-creator, to modify state

There are lots of other ways to handle this, including ignoring the advice to not have side-effects and just firing off actions whenever you want, but these are the most popular, and will probably be easier to follow. I generally like the first one the best, probably because I like `Promise` and `async`/`await` syntax, and my API functions are generally wrapped in `Promise`s already. You can use the webpack trick for storybook, above, to include all the files in a `actions/` dir, if you want to load your app's reducer entirely from a bunch of files.


#### webpack

You may have to read about webpack, if you want your app/storybook to load other kinds of files ([CSS Modules](https://github.com/css-modules/css-modules), [SASS](http://sass-lang.com/), [LESS](http://lesscss.org/), etc.) You can eject yourself from `create-react-app` with `npm run eject`, but the generated config tends to be super over-complicated, and I don't like all the extra junk it adds to a project. 

I do this instead:

```
npm i -D webpack-dev-server webpack cross-env babel-loader babel-preset-env jest babel-jest babili-webpack-plugin css-loader sass-loader node-sass image-webpack-loader file-loader
```

`package.json`:

```json
"scripts": {
  "start": "webpack-dev-server --progress --quiet --hot --inline --no-info --open --history-api-fallback --content-base=./public",
  "build": "cross-env NODE_ENV=production webpack --progress",
  "test": "cross-env NODE_ENV=test jest --coverage --env=jsdom --notify",
  "test:watch": "cross-env NODE_ENV=test jest --coverage --env=jsdom --notify --watch",
  "lint": "standard --fix",
  "storybook": "start-storybook -p 6006",
  "build-storybook": "build-storybook --output-dir storybook"
},
"babel": {
  "presets": ["env", "react"]
}
```

After that you can remove the `"@storybook/react"` line from `package.json`.

`webpack.config.babel.js`:

```js
import { DefinePlugin, optimize } from 'webpack'
import { resolve } from 'path'
import BabiliPlugin from 'babili-webpack-plugin'
const { ModuleConcatenationPlugin } = optimize

// exposed environemnt
const env = {
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
  }
}

const config = {
  entry: {
    app: [
      './src/index'
    ]
  },
  output: {
    path: resolve(__dirname, './public/build'), // YOUR OUTPUT LOCATION
    publicPath: '/build/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {loader: 'babel-loader'}
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              minimize: process.env.NODE_ENV === 'production',
              sourceMap: process.env.NODE_ENV !== 'production',
              modules: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              minimize: process.env.NODE_ENV === 'production',
              sourceMap: process.env.NODE_ENV !== 'production'
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin(env)
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new ModuleConcatenationPlugin())
  config.plugins.push(new BabiliPlugin({}, {comments: false}))
} else {
  config.devtool = 'source-map'
}

export default config
```

`public/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <title>MY SITE</title>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
  </body>
  <script src="build/app.js"></script>
</html>
```

This will build directly into `public/build` (remember to update your `.gitignore`) which seems less awkward than all the rigamarole around paths and copying files.

Since I enabled css-modules (which overwrites classNames, so they are namespaced) the demo `src/App.js` will need a little editing:

```js
import React from 'react'
import logo from './logo.svg'
import c from './App.css'

export const App = () => (
  <div className={c['App']}>
    <div className={c['App-header']}>
      <img src={logo} className={c['App-logo']} alt='logo' />
      <h2>Welcome to React</h2>
    </div>
    <p className={c['App-intro']}>
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
  </div>
)

export default App
```

If the CSS was written a bit differently, you wouldn't need so much namespacing, but that is how to get it working with the current CSS, as-is.
