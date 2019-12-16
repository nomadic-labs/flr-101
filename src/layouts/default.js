import React, { Fragment } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import withRoot from '../utils/withRoot';

import Notification from "../components/notifications/Notification";
import AccountButton from "../components/navigation/AccountButton"

import {
  EditablesContext,
  theme
} from 'react-easy-editables';

import "../assets/sass/less-cms/base.scss";
import "../assets/sass/custom.scss";

import favicon from '../assets/images/icon.png'


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
  };
};


const DefaultLayout = props => (
  <div style={styles.container}>
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
        <Fragment>{props.children}</Fragment>
      </div>
    </EditablesContext.Provider>
  </div>
);

export default withRoot(connect(mapStateToProps, null)(DefaultLayout));


