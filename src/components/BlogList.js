import React from 'react'
import { Container, Card, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import Link from 'gatsby-link'

import Tags from './Tags'

export const BlogList = ({post}) => (
  <Card style={{marginBottom: 10}}>
    <CardBody>
      <CardTitle><Link to={post.frontmatter.path}>{post.frontmatter.title}</Link></CardTitle>
      <CardSubtitle style={{marginBottom: 10}}>{post.frontmatter.date}</CardSubtitle>
      <CardText>{post.excerpt}</CardText>
      {post.frontmatter.tags && (<Tags className='text-right' tags={post.frontmatter.tags} />)}
    </CardBody>
  </Card>
)

export default BlogList
