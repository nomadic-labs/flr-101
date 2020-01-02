import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';

import {
  updatePage,
  loadPageData,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import { EditableText, EditableParagraph, EditableBackgroundImage } from "react-easy-editables";
import { uploadImage } from "../firebase/operations"


const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageData: (page, id, data) => {
      dispatch(updatePage(page, id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data
  };
};

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
  }

  onSave = id => content => {
    this.props.onUpdatePageData("home", id, content);
  };

  render() {
    const content = this.props.pageData ? this.props.pageData.content : {};

    return (
      <Layout>
        <EditableBackgroundImage content={content["landing-bg-image"]} handleSave={this.onSave("landing-bg-image")} uploadImage={uploadImage} classes="landing-bg-image">
          <section id="landing" className="wow fadeIn">
            <Container maxWidth="sm">
              <h1><EditableText content={content["landing-title"]} handleSave={this.onSave("landing-title")} /></h1>
              <EditableParagraph content={content["landing-description"]} handleSave={this.onSave("landing-description")} classes="landing-subtitle" />
            </Container>
          </section>
        </EditableBackgroundImage>

        <section id="about" className="wow fadeIn">
          <Container maxWidth="md">
            <h2 className="underline">
              <EditableText content={content["about-title"]} handleSave={this.onSave("about-title")} />
            </h2>
            <EditableParagraph content={content["about-description"]} handleSave={this.onSave("about-description")} />

            <h3 className="subheading">
              <EditableText content={content["about-disclaimer-heading"]} handleSave={this.onSave("about-disclaimer-heading")} />
            </h3>
            <EditableParagraph content={content["about-disclaimer-text"]} handleSave={this.onSave("about-disclaimer-text")} />

            <h3 className="subheading">
              <EditableText content={content["about-accessibility-heading"]} handleSave={this.onSave("about-accessibility-heading")} />
            </h3>
            <EditableParagraph content={content["about-accessibility-text"]} handleSave={this.onSave("about-accessibility-text")} />

          </Container>
        </section>

        <section id="course-modules" className="wow fadeIn">
          <Container maxWidth="md">
            <h2 className="underline">
              <EditableText content={content["modules-title"]} handleSave={this.onSave("modules-title")} />
            </h2>
          </Container>
        </section>

      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

export const query = graphql`
  query {
    pages(id: { eq: "home" }) {
      id
      content
      title
      description
      slug
    }
  }
`;


