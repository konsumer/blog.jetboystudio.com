import React from 'react'
import slugify from 'slugify'
import {Link} from 'react-router'

const Tags = props => {
  const { post, ...rest } = props
  return (
    <div className="Tags" {...rest}>
      {(props.post.tags || []).map((tag, i) => {
         return [i !== 0 ? ' | ' : null,
           <Link key={i} className="tag" to={{pathname:'/tags/', hash: slugify(tag).toLowerCase()}}>
             {tag}
           </Link>]
       })}
    </div>
  )
}

export default Tags
