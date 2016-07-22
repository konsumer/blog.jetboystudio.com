import React from 'react'
import moment from 'moment'
import DocumentTitle from 'react-document-title'
import { fixLinks } from 'utils'
// import Disqus from 'components/Disqus'

import ReadNext from 'components/ReadNext'
import Bio from 'components/Bio'
import Tags from 'components/Tags'
import { rhythm } from 'utils/typography'
import { config } from 'config'

import 'css/zenburn.css'

class MarkdownWrapper extends React.Component {
  componentDidMount () {
    fixLinks(this.refs.markdown, this.context.router)
  }

  render () {
    const { route } = this.props
    const post = route.page.data

    return (
    <DocumentTitle title={post.title ? `${post.title} | ${config.blogTitle}` : config.blogTitle}>
      <div className="markdown">
        <h1 style={{ marginTop: 0 }}>{post.title}</h1>
        {!post.date ? null : <em style={{ display: 'block', marginBottom: rhythm(2) }}>Posted {moment(post.date).format('MMMM D, YYYY')}</em>}
        <Tags post={post} style={{ marginBottom: rhythm(2) }} />
        <div ref="markdown" dangerouslySetInnerHTML={{__html: post.body}} />
        <hr style={{ marginBottom: rhythm(2) }} />
        <ReadNext post={post} pages={route.pages} />
        <Bio />
        {/* <Disqus shortname={config.disqusShortname} title={post.title} url={`${config.disqusUrlPrefix}${route.page.path}`} /> */}
      </div>
    </DocumentTitle>
    )
  }
}

MarkdownWrapper.propTypes = {
  route: React.PropTypes.object
}

MarkdownWrapper.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default MarkdownWrapper
