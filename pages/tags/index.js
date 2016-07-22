import React from 'react'
import slugify from 'slugify'
import { Link } from 'react-router'
import DocumentTitle from 'react-document-title'

import Summary from 'components/Summary'
import { config } from 'config'

function tagMap (tag) {
  return slugify(tag).toLowerCase()
}

function getTags (page) {
  return page.data.tags
}

class BlogTags extends React.Component {
  render () {
    const tag = this.props.location.hash.replace('#', '')
    const taggedPages = this.props.route.pages
      .filter(getTags)
      .filter(page => getTags(page).map(tagMap).indexOf(tag) !== -1)

    return (
    <DocumentTitle title={tag ? `${tag} - ${config.blogTitle}` : config.blogTitle}>
      <div>
        {!tag ? null : <h2>{tag}</h2>}
        {taggedPages.map(page => (
           <div key={page.data.path}>
             <h3><Link to={page.data.path}> {page.data.title} </Link></h3>
             <Summary body={page.data.body} />
           </div>
         ))}
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
