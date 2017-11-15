module.exports = {
  siteMetadata: {
    title: 'Drunken Coder Blog',
    author: 'konsumer',
    authorLink: 'https://github.com/konsumer',
    disqus: 'jetboystudio'
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
            // this is the language in your code-block that triggers mermaid parsing
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
