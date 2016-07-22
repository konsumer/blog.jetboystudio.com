import React from 'react'
import slugify from 'slugify'
import { Link } from 'react-router'
import DocumentTitle from 'react-document-title'
import uniq from 'lodash/uniq'

import Summary from 'components/Summary'
import { config } from 'config'

function tagMap (tag) {
  return slugify(tag).toLowerCase()
}

function getTags (page) {
  return page.data.tags || []
}

const TaggedPage = ({page, hideSummary}) => (
  <li>
    <Link to={page.data.path}>
    {page.data.title}
    </Link>
    {hideSummary ? null : <Summary body={page.data.body} />}
  </li>
)

const ShowTag = ({tag, pages, hideSummary}) => {
  const taggedPages = pages
    .filter(getTags)
    .filter(page => getTags(page).map(tagMap).indexOf(tag) !== -1)
  return (
  <div>
    <h2>{tag}</h2>
    <ul>
      {taggedPages.map((page, i) => (<TaggedPage hideSummary={hideSummary} key={i} page={page} />))}
    </ul>
  </div>
  )
}

class BlogTags extends React.Component {
  render () {
    const tag = this.props.location.hash.replace('#', '')
    const allTags = tag ? [] : uniq([].concat.apply([], this.props.route.pages.map(page => getTags(page).map(tagMap)))).sort()
    return (
    <DocumentTitle title={tag ? `${tag} - ${config.blogTitle}` : config.blogTitle}>
      <div>
        {tag ? <ShowTag tag={tag} pages={this.props.route.pages} /> : null}
        {!tag ? allTags.map((tag, i) => <ShowTag
                                          hideSummary={true}
                                          key={i}
                                          tag={tag}
                                          pages={this.props.route.pages} />) : null}
      </div>
    </DocumentTitle>
    )
  }
}

BlogTags.propTypes = {
  route: React.PropTypes.object,
  location: React.PropTypes.object
}

export default BlogTags
