import React, { Fragment } from "react";
import { StaticQuery, graphql } from "gatsby"
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { filter } from 'lodash'
import withRoot from '../utils/withRoot';

import Notification from "../components/notifications/Notification";
import AccountButton from "../components/navigation/AccountButton"
import Footer from "../components/navigation/Footer"
import Header from "../components/navigation/Header"
import CreatePageModal from "../components/editing/CreatePageModal";

import {
  EditablesContext
} from 'react-easy-editables';

import { setOrderedPages, setCurrentLang, setPages } from "../redux/actions"

import "../assets/sass/less-cms/base.scss";
import "../assets/sass/custom.scss";

import favicon from '../assets/images/icon.png'

export const theme = {
  primaryColor: "#E57A68",
  fontFamily: "Montserrat, sans-serif",
  fontSize: "14px",
  editContainer: {
    backgroundColor: "rgba(255,255,255,0.3)",
    border: "1px solid black",
    position: "relative",
    padding: "8px",
  },
  editContainerHighlight: {
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "1px solid #E57A68",
    zIndex: "2500",
  },
  actions: {
    position: "absolute",
    left: "2px",
    top: "2px",
    display: "flex",
    alignItems: "center",
    zIndex: "99",
  },
  button: {
    border: "1px solid #000",
    color: "black",
    backgroundColor: "#fff",
    height: "18px",
    width: "18px",
    borderRadius: "30px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "4px",
    "&:hover": {
      backgroundColor: "#eee"
    }
  },
  saveButton: {
    backgroundColor: "#E57A68",
  },
  cancelButton: {
    backgroundColor: "#E57A68",
  },
  icon: {
    fontSize: "14px"
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: '1'
  }
}

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    pageData: state.page.data,
    pages: state.pages.pages,
    orderedPages: state.pages.orderedPages,
    currentLang: state.navigation.currentLang,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPages: pages => {
      dispatch(setPages(pages));
    },
    setOrderedPages: orderedPages => {
      dispatch(setOrderedPages(orderedPages));
    },
    setCurrentLang: lang => {
      dispatch(setCurrentLang(lang));
    },
  };
};


class DefaultLayout extends React.Component {
  componentDidMount() {
    const currentLang = this.props.pageData ? this.props.pageData.lang : "en";
    const modulePages = filter(this.props.allPages, page => (page.category === "modules" && page.lang === currentLang))
    const orderedPages = this.orderedPages(modulePages.find(page => page.head))

    this.props.setOrderedPages(orderedPages)
    this.props.setCurrentLang(currentLang)
    this.props.setPages(this.props.allPages)
  }

  nextPage = page => {
    return this.props.allPages[page.next];
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
    return(
      <div style={styles.container} className={`nl-page ${props.className || ""}`}>
        <Helmet>
          <title>
            Feminist Law Reform 101
          </title>
          <meta
            charSet="utf-8"
            description="An open online course about feminist law reform from the National Association of Women and the Law"
            keywords="law, law reform, feminist, feminism, NAWL, National Association of Women and the Law, FLR 101"
            viewport="width=device-width,initial-scale=1.0,maximum-scale=1"
          />
          <link rel="icon" href={favicon} type="image/x-icon" />
        </Helmet>
        <Notification />
        <AccountButton />

        <EditablesContext.Provider value={ { theme: theme, showEditingControls: props.isEditingPage } }>
          <div className="page-wrapper">
            <Header { ...props } />
            <Fragment>{props.children}</Fragment>
            <Footer { ...props } />
          </div>
          <CreatePageModal />
        </EditablesContext.Provider>
      </div>
    )
  }
}

const LayoutContainer = props => (
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
              head
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
        <DefaultLayout data={data} allPages={pages} {...props} />
      )
    }}
  />
)

export default withRoot(connect(mapStateToProps, mapDispatchToProps)(LayoutContainer));


