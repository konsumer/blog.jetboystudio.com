import React from 'react'
import { Container, Badge } from 'reactstrap'
import Link from 'gatsby-link'

export const Tags = ({tags, className}) => (
  <Container className={`tags ${className}`}>
    {tags.map(tag => <Link key={tag} to={`/tag/${tag}`}><Badge pill>{tag}</Badge></Link>)}
  </Container>
)

export default Tags
