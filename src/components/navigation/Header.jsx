import React from "react";
import { StaticQuery, graphql } from "gatsby"

import logo from "../../assets/images/nawl-logo.svg"

const homeUrls = {
  en: "/",
  fr: "/fr/"
}

const Header = props => (
  <StaticQuery
    query={graphql`
      query {
        allPages {
          edges {
            node {
              id
              title
              slug
              lang
              category
            }
          }
        }
      }
    `}
    render={data => {
      const currentLang = props.pageData ? props.pageData.lang : "en";
      const home = homeUrls[currentLang];

      return (
        <nav className="navbar">
          <div className="logo">
            <a href={home}><img src={logo} alt="NAWL | ANFD" /></a>
          </div>
        </nav>
      );
    }}
  />
)

export default Header;
