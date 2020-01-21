import React from "react";
import { connect } from "react-redux";

import CourseModule from "./CourseModule"

const mapStateToProps = state => {
  return {
    orderedPages: state.pages.orderedPages,
  };
};


const CourseModules = props => (
  <div>
    {
      props.orderedPages.map((page, index) => {
        return <CourseModule page={page} order={index + 1} key={page.id} />
      })
    }
  </div>
)


export default connect(mapStateToProps, null)(CourseModules);
