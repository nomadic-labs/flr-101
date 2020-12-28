import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import { EditableText, EditableParagraph,  } from "react-easy-editables";
import ExpandableText from "../components/common/ExpandableText"

import {
  updatePage,
  loadPageData,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import CourseModules from "../components/common/CourseModules"
import T from "../components/common/Translation"
import verticalHeader from "../assets/images/header-vertical.jpg"

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
    pageData: state.page.data,
    isLoggedIn: state.adminTools.isLoggedIn,
  };
};

class HomePage extends React.Component {

  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
  }

  onSave = id => content => {
    this.props.onUpdatePageData("nawl", id, content);
  };

  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);

    return (
      <Layout light={true} location={this.props.location}>
        <div className="bg-image title-main" data-aos="fade-in">
          <section id="landing" className="wow fadeIn">
            <Container maxWidth="lg">
              <h1><EditableText content={content["landing-title"]} handleSave={this.onSave("landing-title")} /></h1>
              <div className="landing-subtitle"><EditableText content={content["landing-subtitle"]} handleSave={this.onSave("landing-subtitle")} /></div>
            </Container>
          </section>
        </div>
        <div className="title-mobile" data-aos="fade-in">
          <img src={verticalHeader} alt="" />
          <div className="bg-dark course-title">
            <div className="text-light title">
              <div className="title-script"><T id="title_part_1" /></div>
              <div className="title-print"><T id="title_part_2" /></div>
            </div>
          </div>
        </div>

        <section id="about" className="wow fadeIn">
          <Container maxWidth="md" data-aos="fade-in">
            <h2 className="underline">
              <EditableText content={content["about-title"]} handleSave={this.onSave("about-title")} />
            </h2>
            <EditableParagraph content={content["about-description"]} handleSave={this.onSave("about-description")} />

            <ExpandableText content={content["disclaimer"]} onSave={this.onSave("disclaimer")} />

            <ExpandableText content={content["accessiblity"]} onSave={this.onSave("accessiblity")} />

          </Container>
        </section>

        <section id="acknowledgements" className="wow fadeIn highlight">
          <Container maxWidth="md" data-aos="fade-in">
            <h2 className="">
              <EditableText content={content["acknowledgements-header"]} handleSave={this.onSave("acknowledgements-header")} />
            </h2>
            <EditableParagraph content={content["acknowledgements"]} handleSave={this.onSave("acknowledgements")} />
          </Container>
        </section>

        <section id="course-modules" className="wow fadeIn">
          <Container maxWidth="md" data-aos="fade-in">
            <h2 className="underline">
              <EditableText content={content["modules-title"]} handleSave={this.onSave("modules-title")} />
            </h2>
            <CourseModules />
          </Container>
        </section>

        <section id="nawl" className="wow fadeIn highlight">
          <Container maxWidth="md" data-aos="fade-in">
            <h2 className="">
              <EditableText content={content["nawl-header"]} handleSave={this.onSave("nawl-header")} />
            </h2>
            <EditableParagraph content={content["nawl-description"]} handleSave={this.onSave("nawl-description")} />
          </Container>
        </section>

      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

export const query = graphql`
  query {
    pages(id: { eq: "nawl" }) {
      id
      content
      title
      description
      slug
      lang
      translation
    }
  }
`;


