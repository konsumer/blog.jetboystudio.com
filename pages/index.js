import React from 'react'
import { Link } from 'react-router'
import sortBy from 'lodash/sortBy'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import { rhythm } from 'utils/typography'
import access from 'safe-access'
import { config } from 'config'
import include from 'underscore.string/include'
import Bio from 'components/Bio'
import Summary from 'components/Summary'
import moment from 'moment'

const style = {
  date: {
    color: 'grey'
  },
  li: {  marginBottom: rhythm(1 / 4)},
  Link: {boxShadow: 'none'}
}

class BlogIndex extends React.Component {
  render () {
    const pageLinks = []
    // Sort pages.
    const sortedPages = sortBy(this.props.route.pages, (page) => access(page, 'data.date')
    ).reverse()
    sortedPages.forEach((page) => {
      if (access(page, 'file.ext') === 'md' && !include(page.path, '/404')) {
        const title = access(page, 'data.title') || page.path
        pageLinks.push(
          <li key={page.path} style={style.li}>
            <Link style={style.Link} to={prefixLink(page.path)}>
            {title}
            </Link>
            <div style={style.date}>
              {moment(page.data.date).calendar()}
            </div>
            <Summary body={page.data.body} />
            <small><Link to={prefixLink(page.path)}> more </Link></small>
          </li>
        )
      }
    })
    return (
    <DocumentTitle title={config.blogTitle}>
      <div>
        <Bio />
        <ul>
          {pageLinks}
        </ul>
      </div>
    </DocumentTitle>
    )
  }
}

BlogIndex.propTypes = {
  route: React.PropTypes.object
}

export default BlogIndex
