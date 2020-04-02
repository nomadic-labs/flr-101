import React from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import { findIndex } from "lodash"

import { connect } from "react-redux";
import { EditableImageUpload } from "react-easy-editables";
import { uploadImage } from "../firebase/operations";

import {
  updatePage,
  loadPageData,
  updateTitle,
  updateHeaderImage,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import DynamicSection from "../components/editing/DynamicSection";
import CourseModule from "../components/common/CourseModule";
import T from "../components/common/Translation"


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
    pageData: state.page.data,
    orderedPages: state.pages.orderedPages,
    pages: state.pages.pages,
    currentLang: state.navigation.currentLang,
  };
};


class CourseModulePage extends React.Component {
  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
  }

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
    const moduleOrder = findIndex(this.props.orderedPages, p => p.id === pageData.id) + 1;
    const nextModule = this.props.pages[pageData.next];

    return (
      <Layout location={this.props.location}>
        <Helmet>
          <title>{pageData.title}</title>
          <meta description={pageData.description} />
        </Helmet>

        <Container maxWidth="md">
          <header className="module-header">
            <p className="text-muted bold" style={{ marginTop: 0 }}>{Boolean(moduleOrder) && `Module ${moduleOrder}`}</p>
            <h2 className="underline">{pageData.title}</h2>
          </header>

          <EditableImageUpload
            styles={{ container: {display: 'flex', alignItems: 'flex-start'} }}
            onSave={ this.onUpdateHeaderImage }
            uploadImage={ uploadImage }
            content={ content.headerImage || { imageSrc: null } }
            maxSize={1024 * 1024 * 12}
          />
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

        {
          nextModule &&
          <section>
          <Container maxWidth="md">
            <header className="module-header">
              <h2 className="underline"><T id="next_module" /></h2>
            </header>
            <CourseModule page={nextModule} order={moduleOrder + 1} />
          </Container>
          </section>
        }
      </Layout>
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
      next
      category
      translations {
        en {
          slug
          id
        }
        fr {
          slug
          id
        }
      }
    }
  }
`;
