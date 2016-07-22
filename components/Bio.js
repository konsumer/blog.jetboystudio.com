import React from 'react'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'
import profilePic from 'profile-pic.png'

const Bio = props => (
  <p style={{  marginBottom: rhythm(2.5)}}>
    <img src={prefixLink(profilePic)} alt={`author ${config.authorName}`} style={{  float: 'left',  marginRight: rhythm(1 / 4),  marginBottom: 0,  width: rhythm(2),  height: rhythm(2)}} /><span dangerouslySetInnerHTML={{__html: config.authorBio}} />
  </p>
)

export default Bio
