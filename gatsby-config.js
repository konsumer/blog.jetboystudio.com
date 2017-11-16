module.exports = {
  siteMetadata: {
    title: 'Gatsby Starter Blog',
    author: 'konsumer',
    authorLink: 'https://github.com/konsumer',
    disqus: 'gatsby-starter-blog'// put your disqus ID here
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-graph',
            options: {
              language: 'mermaid', // default
              theme: 'dark' // could also be default, forest, or neutral
            }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files'
        ]
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass'
  ]
}
