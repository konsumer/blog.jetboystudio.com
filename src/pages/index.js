import React from 'react'
import { Container } from 'reactstrap'
import graphql from 'graphql'

import BlogList from '../components/BlogList'

const IndexPage = ({ data }) => (
  <Container>
    {data.allMarkdownRemark.edges.filter(post => post.node.frontmatter.contentType === 'blog').map(({ node: post }) => (
      <BlogList post={post} key={post.id} />
    ))}
  </Container>
)

export default IndexPage

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          frontmatter {
            title
            contentType
            date(formatString: "MMMM DD, YYYY")
            path
            tags
          }
        }
      }
    }
  }
`
