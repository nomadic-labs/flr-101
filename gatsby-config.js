
let activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

const firestoreConfig = require(`./config/firebase-config.${process.env.GATSBY_FIREBASE_ENVIRONMENT}.json`)

module.exports = {
  siteMetadata: {
    title: `Feminist Law Reform 101`,
  },
  pathPrefix: `/`,
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Feminist Law Reform 101",
        short_name: "Feminist Law Reform 101",
        start_url: "/",
        background_color: "#000",
        theme_color: "#FCB239", // yellow
        display: "minimal-ui",
        icon: "static/icon.png" // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-firestore",
      options: {
        credential: firestoreConfig.serviceAccountKey,
        types: [
          {
            type: "Pages",
            collection: "pages",
          },
          {
            type: "Translations",
            collection: "translations",
          },
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        precision: 8,
      },
    },
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "flr-101",
        protocol: "https",
        hostname: process.env.GATSBY_HOSTNAME,
      },
    },
  ]
};
