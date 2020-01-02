import React from "react";
import slugify from "slugify";
import { find } from 'lodash';

import { connect } from "react-redux";
import {
  toggleNewPageModal,
  createPage,
  updateFirebaseData,
  fetchPages,
} from "../../redux/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { PAGE_TYPES, LANGUAGE_OPTIONS } from "../../utils/constants";

import defaultContentJSON from "../../fixtures/pageContent.json";

const mapStateToProps = state => {
  return {
    showNewPageModal: state.adminTools.showNewPageModal,
    newPage: state.adminTools.newPage,
    page: state.page.data,
    categories: state.categories.categories,
    topics: state.topics.topics,
    pages: state.pages.pages,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleNewPageModal: () => {
      dispatch(toggleNewPageModal());
    },
    updateFirebaseData: (data, callback) => {
      dispatch(updateFirebaseData(data, callback))
    },
    createPage: (pageData, pageId) => {
      dispatch(createPage(pageData, pageId));
    },
    fetchPages: () => {
      dispatch(fetchPages())
    },
  };
};

const emptyPage = {
    title: "",
    description: "",
    category: "modules",
    lang: LANGUAGE_OPTIONS[0].value,
    type: PAGE_TYPES[0].value,
  }

class CreatePageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {
        ...this.props.page,
        description: this.props.page.description || "",
        lang: this.props.page.lang || LANGUAGE_OPTIONS[0].value,
      }
    };
    this.updatePage = (field, value) => {
      this._updatePage(field, value);
    };
    this.onSubmit = () => {
      this._onSubmit();
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.newPage !== this.props.newPage) {
      this.setState({ page: this.props.newPage ? emptyPage : {
        ...this.props.page,
        lang: this.props.page.lang || LANGUAGE_OPTIONS[0].value,
      } })
    }

    if (!prevProps.showNewPageModal && this.props.showNewPageModal) {
      this.props.fetchPages()
    }
  }

  _updatePage(field, value) {
    this.setState({
      page: {
        ...this.state.page,
        [field]: value
      }
    });
  }

  _onSubmit() {
    const slugifiedTitle = slugify(this.state.page.title, {
      lower: true,
      remove: /[$*_+~.,()'"!\-:@%^&?=]/g
    })

    const lastPage = find(this.props.pages, (page => !page.next));

    let pageData = {
      title: this.state.page.title,
      description: this.state.page.description,
      lang: this.state.page.lang,
    };

    if (this.props.newPage) {
      pageData.content = defaultContentJSON;
      pageData.slug = `${this.state.page.lang}/${slugifiedTitle}`;
      pageData.template = this.state.page.type.template;
      pageData.prev = lastPage ? lastPage.id : null;
    }

    const pageId = this.props.newPage ? slugifiedTitle : this.props.page.id;

    this.props.createPage(pageData, pageId);

    if (lastPage) {
      this.props.updateFirebaseData({
        [`pages/${lastPage.id}/next`]: pageId,
      })
    }
  }

  render() {
    const open = Boolean(this.props.showNewPageModal);

    return (
      <Dialog open={open} aria-labelledby="create-page-dialogue">
        <DialogTitle id="create-page-dialogue">
          { this.props.newPage ? "Create new module" : "Module configuration" }
        </DialogTitle>


        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              className="form-control"
              type="text"
              label={"Page title"}
              value={this.state.page.title}
              onChange={e => this.updatePage("title", e.currentTarget.value)}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              className="form-control"
              type="text"
              label={"Short description"}
              value={this.state.page.description}
              onChange={e => this.updatePage("description", e.currentTarget.value)}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="menu-group">Language</InputLabel>
            <Select
              value={this.state.page.lang}
              onChange={selected =>
                this.updatePage("lang", selected.target.value)
              }
              inputProps={{
                name: "menu-group",
                id: "menu-group"
              }}
            >
              {LANGUAGE_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>

        <DialogActions>
          <Button color="default" onClick={this.props.onToggleNewPageModal}>
            Close
          </Button>
          <Button color="secondary" onClick={this.onSubmit}>
            { this.props.newPage ? "Create page" : "Save" }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}


CreatePageModal.defaultProps = {
  page: emptyPage
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CreatePageModal
);
