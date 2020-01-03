import React from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"

import { connect } from "react-redux";
import {
  updatePage,
  loadPageData,
  updateTitle,
  updateHeaderImage,
} from "../redux/actions";

import Layout from "../layouts/default.js";
// import PageHeader from "../components/common/PageHeader";
import DynamicSection from "../components/editing/DynamicSection";


const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageData: (page, id, data) => {
      dispatch(updatePage(page, id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    onUpdateTitle: title => {
      dispatch(updateTitle(title));
    },
    onUpdateHeaderImage: image => {
      dispatch(updateHeaderImage(image));
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data
  };
};


class CourseModulePage extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };
    this.props.onLoadPageData(initialPageData);
  };

  onSave = id => content => {
    this.props.onUpdatePageData(this.props.data.pages.id, id, content);
  };

  onUpdateTitle = content => {
    this.props.onUpdateTitle(content.text)
  }

  onUpdateHeaderImage = content => {
    this.props.onUpdateHeaderImage(content)
  }

  render() {
    const pageData = this.props.pageData ? this.props.pageData : this.props.data.pages;
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);
    const sections = content.sections && content.sections.length > 0 ? content.sections : [{ content: [] }];

    return (
      <div>
        <Layout location={this.props.location}>
          <Helmet>
            <title>{pageData.title}</title>
            <meta description={pageData.description} />
          </Helmet>

          <Container maxWidth="md">
            <h2 className="underline">{pageData.title}</h2>
          </Container>

          {
            sections.map((section, index) => {
              if (!section || !section.content) {
                return null
              }

              return(
                <DynamicSection
                  content={ section.content }
                  sectionIndex={index}
                  key={index}
                  type={ section.type }
                />
              )
            })
          }
        </Layout>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseModulePage);

export const query = graphql`
  query BasicPageQuery($slug: String!) {
    pages(slug: { eq: $slug }) {
      id
      content
      title
      description
      slug
      lang
      template
    }
  }
`;