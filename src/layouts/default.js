import React, { Fragment } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import withRoot from '../utils/withRoot';

import Notification from "../components/notifications/Notification";
import AccountButton from "../components/navigation/AccountButton"
import Footer from "../components/navigation/Footer"
import CreatePageModal from "../components/editing/CreatePageModal";

import {
  EditablesContext
} from 'react-easy-editables';

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
  };
};


const DefaultLayout = props => (
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
        <Fragment>{props.children}</Fragment>
        <Footer { ...props } />
      </div>
      <CreatePageModal />
    </EditablesContext.Provider>
  </div>
);

export default withRoot(connect(mapStateToProps, null)(DefaultLayout));


