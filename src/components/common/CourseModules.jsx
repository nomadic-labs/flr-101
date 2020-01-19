import React from "react";
import { StaticQuery, graphql } from "gatsby"
import { filter } from 'lodash'

import CourseModule from "./CourseModule"


class CourseModules extends React.Component {
  nextPage = page => {
    return this.props.pages[page.next];
  }

  prevPage = page => {
    return this.props.pages[page.prev];
  }

  orderedPages = (page, arr=[]) => {
    if (!page) {
      return arr
    }

    if (arr.includes(page)) {
      return arr
    }

    arr.push(page)

    const nextPage = this.nextPage(page)
    if (page === nextPage) {
      return arr
    }
    return this.orderedPages(this.nextPage(page), arr)
  }

  render() {
    const { props } = this;
    const currentLang = props.pageData ? props.pageData.lang : "en";
    const modulePages = filter(props.pages, page => (page.category === "modules" && page.lang === currentLang))
    const orderedPages = this.orderedPages(modulePages.find(page => !page.prev))

    return (
      <div>
        {
          orderedPages.map((page, index) => {
            return <CourseModule page={page} order={index + 1} key={page.id} />
          })
        }
      </div>
    );
  }
}

const CourseModulesContainer = props => (
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
              next
              prev
            }
          }
        }
      }
    `}
    render={data => {
      const pagesArr = data.allPages.edges.map(edge => edge.node);
      const pages = pagesArr.reduce((obj, page) => {
        obj[page.id] = page
        return obj
      }, {})
      return(
        <CourseModules data={data} pages={pages} {...props} />
      )
    }}
  />
)

export default CourseModulesContainer;