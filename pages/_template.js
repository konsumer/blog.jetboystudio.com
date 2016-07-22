import React from 'react'
import { Link } from 'react-router'
import { Container } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import { rhythm, fontSizeToMS } from 'utils/typography'
import { config } from 'config'

const style = {
  Link: {
    boxShadow: 'none',
    textDecoration: 'none',
    color: 'inherit'
  },
  h1: {
    marginBottom: 0,
    fontSize: fontSizeToMS(1.5).fontSize,
    lineHeight: fontSizeToMS(1.5).lineHeight,
    marginTop: 0
  },
  h3: {
    fontFamily: 'Montserrat, sans-serif',
    marginTop: 0
  },
  h2: {
    marginTop: 0,
    textAlign: 'center'
  },
  img: {
    margin: 0,
    border: 0,
    width: '1em',
    height: '1em',
    verticalAlign: 'middle'
  }
}

class Template extends React.Component {
  render () {
    const { location, children } = this.props
    let header
    if (location.pathname === prefixLink('/')) {
      header = (
        <header style={{marginBottom: rhythm(1.5)}}>
          <h1 style={style.h1}><Link style={style.Link} to={prefixLink('/')} > <img src="/favicon.ico" style={style.img}/> {config.blogTitle} </Link></h1>
          <h2 style={style.h2}>{config.subTitle}</h2>
        </header>
      )
    } else {
      header = (
        <header>
          <h3 style={style.h3}><Link style={style.Link} to={prefixLink('/')} > <img src="/favicon.ico" style={style.img}/> {config.blogTitle} </Link></h3>
        </header>
      )
    }
    return (
    <Container style={{  maxWidth: rhythm(24),  padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`}}>
      {header}
      {children}
    </Container>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.any,
  location: React.PropTypes.object,
  route: React.PropTypes.object
}

export default Template
