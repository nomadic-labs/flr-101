import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import {
  updatePage,
  loadPageData,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import { EditableText, EditableParagraph } from "react-easy-editables";


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
        <section id="landing" className="wow fadeIn">
          <EditableText content={content["landing-title"]} handleSave={this.onSave("landing-title")} />
          <EditableParagraph content={content["landing-description"]} handleSave={this.onSave("landing-description")} />
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
      slug
    }
  }
`;


