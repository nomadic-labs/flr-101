import React from 'react'
import { Link } from 'gatsby'
import { connect } from "react-redux";
import { map, find, filter } from 'lodash'
import slugify from "slugify";
import Container from "@material-ui/core/Container"
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import DeleteForever from '@material-ui/icons/DeleteForever';


import Layout from '../layouts/default';
import ProtectedPage from "../layouts/protected-page"

import { PERMANENT_PAGES } from "../utils/constants"

import {
  pushTopic,
  removeTopic,
  pushCategory,
  removeCategory,
  setTopics,
  setCategories,
  fetchTopics,
  fetchCategories,
  fetchPages,
  updatePageData,
  updateFirebaseData,
  deploy,
} from "../redux/actions";


const mapDispatchToProps = dispatch => {
  return {
    pushTopic: topic => {
      dispatch(pushTopic(topic));
    },
    removeTopic: topic => {
      dispatch(removeTopic(topic));
    },
    setTopics: topics => {
      dispatch(setTopics(topics));
    },
    fetchTopics: () => {
      dispatch(fetchTopics())
    },
    pushCategory: category => {
      dispatch(pushCategory(category));
    },
    removeCategory: category => {
      dispatch(removeCategory(category));
    },
    setCategories: categories => {
      dispatch(setCategories(categories));
    },
    fetchCategories: () => {
      dispatch(fetchCategories())
    },
    updateFirebaseData: (data, callback) => {
      dispatch(updateFirebaseData(data, callback))
    },
    fetchPages: () => {
      dispatch(fetchPages())
    },
    deploy: () => {
      dispatch(deploy())
    },
  };
};

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    categories: state.categories.categories,
    topics: state.topics.topics,
    pages: state.pages.pages,
  };
};

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicLabel: "",
      categoryLabel: "",
    }
    this.props.fetchTopics()
    this.props.fetchCategories()
    this.props.fetchPages()
  }

  createTopic = () => {
    const label = this.state.topicLabel
    const id = slugify(label, {
      lower: true,
      remove: /[$*_+~.,()'"!\-:@%^&?=]/g
    })

    const topic = { id, label }
    this.props.pushTopic(topic);
    this.setState({ topicLabel: "" })
  }

  createCategory = () => {
    const label = this.state.categoryLabel
    const id = slugify(label, {
      lower: true,
      remove: /[$*_+~.,()'"!\-:@%^&?=]/g
    })
    const lastCategory = find(this.props.categories, cat => !cat.next)
    const category = { id, label, prev: lastCategory ? lastCategory.id : null }

    this.props.pushCategory(category);

    if (lastCategory) {
      this.props.updateFirebaseData({
        [`categories/${lastCategory.id}/next`]: id
      }, this.props.fetchCategories)
    }

    this.setState({ categoryLabel: "" })
  }

  filterPagesByCategory = (pages, category) => {
    return filter(pages, page => page.category === category.id);
  }

  nextCategory = category => {
    return this.props.categories[category.next];
  }

  prevCategory = category => {
    return this.props.categories[category.prev];
  }

  orderedCategories = (category, arr=[]) => {
    if (!category) {
      return arr
    }

    if (arr.includes(category)) {
      return arr
    }

    arr.push(category)
    return this.orderedCategories(this.nextCategory(category), arr)
  }

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

  movePageForward = currentPage => () => {
    if (!currentPage.next) return false;

    const nextPage = this.nextPage(currentPage)
    const prevPage = this.prevPage(currentPage)
    const nextNextPage = this.nextPage(nextPage)

    let dataToUpdate = {
      [`pages/${currentPage.id}/next`]: nextPage.next || null,
      [`pages/${currentPage.id}/prev`]: nextPage.id,
      [`pages/${nextPage.id}/next`]: currentPage.id,
      [`pages/${nextPage.id}/prev`]: currentPage.prev || null,
    }

    if (prevPage) {
      dataToUpdate[`pages/${prevPage.id}/next`] = nextPage.id
    }

    if (nextNextPage) {
      dataToUpdate[`pages/${nextNextPage.id}/prev`] = currentPage.id
    }

    this.props.updateFirebaseData(dataToUpdate, this.props.fetchPages)
  }

  movePageBack = currentPage => () => {
    if (!currentPage.prev) return false;

    const prevPage = this.prevPage(currentPage)
    const nextPage = this.nextPage(currentPage)
    const prevPrevPage = this.prevPage(prevPage)

    let dataToUpdate = {
      [`pages/${currentPage.id}/next`]: prevPage.id,
      [`pages/${currentPage.id}/prev`]: prevPage.prev || null,
      [`pages/${prevPage.id}/next`]: currentPage.next || null,
      [`pages/${prevPage.id}/prev`]: currentPage.id,
    }

    if (nextPage) {
      dataToUpdate[`pages/${nextPage.id}/prev`] = prevPage.id
    }

    if (prevPrevPage) {
      dataToUpdate[`pages/${prevPrevPage.id}/next`] = currentPage.id
    }

    this.props.updateFirebaseData(dataToUpdate, this.props.fetchPages)
  }

  moveCategoryForward = current => () => {
    if (!current.next) return false;

    const nextCategory = this.nextCategory(current)
    const prevCategory = this.prevCategory(current)
    const nextNextCategory = this.nextCategory(nextCategory)

    let dataToUpdate = {
      [`categories/${current.id}/next`]: nextCategory.next || null,
      [`categories/${current.id}/prev`]: nextCategory.id,
      [`categories/${nextCategory.id}/next`]: current.id,
      [`categories/${nextCategory.id}/prev`]: current.prev || null,
    }

    if (prevCategory) {
      dataToUpdate[`categories/${prevCategory.id}/next`] = nextCategory.id
    }

    if (nextNextCategory) {
      dataToUpdate[`categories/${nextNextCategory.id}/prev`] = current.id
    }

    this.props.updateFirebaseData(dataToUpdate, this.props.fetchCategories)
  }

  moveCategoryBack = current => () => {
    if (!current.prev) return false;

    const prevCategory = this.prevCategory(current)
    const nextCategory = this.nextPage(current)
    const prevPrevCategory = this.prevCategory(prevCategory)

    let dataToUpdate = {
      [`categories/${current.id}/next`]: prevCategory.id,
      [`categories/${current.id}/prev`]: prevCategory.prev || null,
      [`categories/${prevCategory.id}/next`]: current.next || null,
      [`categories/${prevCategory.id}/prev`]: current.id,
    }

    if (nextCategory) {
      dataToUpdate[`categories/${nextCategory.id}/prev`] = prevCategory.id
    }

    if (prevPrevCategory) {
      dataToUpdate[`categories/${prevPrevCategory.id}/next`] = current.id
    }

    this.props.updateFirebaseData(dataToUpdate, this.props.fetchCategories)
  }

  deletePage = page => () => {
    if (typeof window !== 'undefined')  {
      if (!window.confirm("Are you sure you want to delete this page?")) {
        return false
      }
    }

    const prevPage = this.prevPage(page)
    const nextPage = this.nextPage(page)

    let dataToUpdate = {
      [`pages/${page.id}`]: null,
    }

    if (nextPage) {
      dataToUpdate[`pages/${nextPage.id}/prev`] = page.prev || null
    }

    if (prevPage) {
      dataToUpdate[`pages/${prevPage.id}/next`] = page.next || null
    }

    this.props.updateFirebaseData(dataToUpdate, this.props.fetchPages)
  }

  render() {
    const pagesByCategory = [];
    const orderedCategories = this.orderedCategories(find(this.props.categories, cat => !cat.prev));
    const uncategorizedPages = filter(this.props.pages, page => !Boolean(page.category))

    orderedCategories.forEach(category => {
      const categoryPages = this.filterPagesByCategory(this.props.pages, category)
      const pages = this.orderedPages(categoryPages.find(page => !page.prev))

      if (pages.length > 0) {
        pagesByCategory.push({ ...category, pages })
      }
    })

    return(
      <Layout>
        <ProtectedPage>
          <Container>
            <h1 className="text-center mb-40">
              Website Configuration
            </h1>
          </Container>

          <Container>
            <h2>Page Order</h2>
            <div className="my-4">
              {
                pagesByCategory.map(category => {
                  return(
                    <div key={category.id}>
                      <h4 className="mt-3">{category.label}</h4>
                      {
                        category.pages.map(page => {
                          return(
                            <div className="ranked-item" key={page.id}>
                              <IconButton size="small" color="primary" onClick={this.movePageBack(page)} disabled={!page.prev}><ArrowUp /></IconButton>
                              <IconButton size="small" color="primary" onClick={this.movePageForward(page)} disabled={!page.next}><ArrowDown /></IconButton>
                              <IconButton size="small" color="primary" onClick={this.deletePage(page)} disabled={PERMANENT_PAGES.includes(page.id)}><DeleteForever /></IconButton>
                              <span className="ml-3"><Link to={page.slug}>{page.title}</Link></span>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          </Container>

          <Container>
            <h2>Uncategorized Pages</h2>
            <div className="my-4">
              {
                uncategorizedPages.map(page => {
                  return(
                    <div className="ranked-item" key={page.id}>
                      <IconButton size="small" color="primary" onClick={this.deletePage(page)} disabled={PERMANENT_PAGES.includes(page.id)}><DeleteForever /></IconButton>
                      <span className="ml-3"><Link to={page.slug}>{page.title}</Link></span>
                    </div>
                  )
                })
              }
            </div>
          </Container>

          <Container>
            <div className="my-5">
              <Button onClick={this.props.deploy} variant="contained" color="primary">Publish changes</Button>
            </div>
          </Container>
        </ProtectedPage>
      </Layout>
    )
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
