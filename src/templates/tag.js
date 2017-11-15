import React from 'react'
import { Container } from 'reactstrap'
import Helmet from 'react-helmet'
import graphql from 'graphql'

import BlogList from '../components/BlogList'

const TagPage = ({ data, pathContext }) => {
  const { site: { siteMetadata }} = data
  const { tag } = pathContext
  // TODO: can I do this in the graphql?
  const posts = data.allMarkdownRemark.edges
    .filter(post => post.node.frontmatter.contentType === 'blog' && post.node.frontmatter.tags.map(t => t.toLowerCase()).indexOf(tag.toLowerCase()) !== -1)
    .map(({ node: post }) => post)
  return (
    <div>
      <Helmet title={`${tag} | ${siteMetadata.title}`} />
      <Container>
        <h1 className='display-3'>{tag}</h1>
      </Container>
      <Container>
        {posts.map(post => (
          <BlogList post={post} key={post.id} />
      ))}
      </Container>
    </div>
  )
}
export default TagPage

export const aboutPageQuery = graphql`
  query TagPage {
    site {
      siteMetadata {
        title
      }
    }
    
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          frontmatter {
            title
            path
            contentType
            date(formatString: "MMMM DD, YYYY")
            tags
          }
        }
      }
    }
  }
`
