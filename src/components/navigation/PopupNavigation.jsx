import React from "react";
import { connect } from "react-redux";

import NavigationModule from "./NavigationModule"
import T from "../common/Translation"

const mapStateToProps = state => {
  return {
    orderedPages: state.pages.orderedPages,
    currentLang: state.navigation.currentLang,
    pageData: state.page.data,
    pages: state.pages.pages,
  };
};


const PopupNavigation = props => {
  console.log(props)
  const homePage = props.currentLang === "en" ? props.pages["nawl"] : props.pages["anfd"]
  return (
    <div className="">
      <div className="navigation-module">
        <div className="title">
          <a href={homePage.slug}><T id="home" /></a>
        </div>
      </div>
      {
        props.orderedPages.map((page, index) => {
          return <NavigationModule page={page} order={index + 1} key={page.id} />
        })
      }
    </div>
  );
}

export default connect(mapStateToProps, null)(PopupNavigation);
