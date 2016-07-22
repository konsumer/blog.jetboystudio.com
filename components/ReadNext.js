import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { include as includes } from 'underscore.string'
import find from 'lodash/find'
import intersect from 'just-intersect'
import { rhythm, fontSizeToMS } from 'utils/typography'
import Summary from './Summary'
import slugify from 'slugify'

class ReadNext extends React.Component {
  render () {
    const { pages, post } = this.props
    let { readNext } = post

    const tags = post.tags.map(tag => slugify(tag).toLowerCase())

    // find 5 most similar by tags, and get a random item if readNext isn't set
    if (!readNext) {
      readNext = pages
        .filter(p => p.data.tags && p.data.body !== post.body)
        .map(p => {
          p.diff = intersect(tags, p.data.tags).length
          return p
        })
        .sort((a, b) => a.diff - b.diff)
        .slice(-5)
        .sort((a, b) => Math.random() * -0.5)
        .pop()
        .path
    }

    let nextPost
    if (readNext) {
      nextPost = find(pages, (page) => includes(page.path, readNext.slice(1, -1)))
    }

    if (!nextPost) {
      return null
    } else {
      return (
      <div>
        <h6 style={{  margin: 0,  fontSize: fontSizeToMS(-0.5).fontSize,  lineHeight: fontSizeToMS(-0.5).lineHeight,  letterSpacing: -0.25}}>READ THIS NEXT:</h6>
        <h3 style={{  marginTop: 0,  marginBottom: rhythm(1 / 4)}}><Link to={{  pathname: prefixLink(nextPost.path),  query: { readNext: true }}} > {nextPost.data.title} </Link></h3>
        <Summary body={nextPost.data.body} />
        <hr />
      </div>
      )
    }
  }
}

ReadNext.propTypes = {
  post: React.PropTypes.object.isRequired,
  pages: React.PropTypes.array
}

export default ReadNext
