---
title: 'Mermaid Graphing'
date: 2017-11-14T20:38:47Z
contentType: blog
path: /articles/mermaid/
tags:
  - gatsby
  - mermaid
---

I made a [graph plugin](https://github.com/konsumer/gatsby-remark-graph) for [gatsby](https://www.gatsbyjs.org/) that uses [mermaid](https://mermaidjs.github.io/) to make quick graphs.


```mermaid
graph LR
      A-->B
      B-->C[fa:fa-ban forbidden]
      B-->D(fa:fa-grav);
```

```mermaid
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
```

It works pretty good, if I don't say so myself. On my blog, I'm using the `dark` theme.