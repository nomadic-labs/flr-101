import React from "react";
import PropTypes from "prop-types";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import {
  PlainTextEditor,
  RichTextEditor,
  FileUploadEditor,
  LinkEditor,
  Editable
} from 'react-easy-editables';

import { uploadImage, uploadFile } from "../../firebase/operations"

class PublicationEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: this.props.content };
  }

  handleEditorChange = field => item => {
    this.setState({
      content: {
        ...this.state.content,
        [field]: {
          ...item
        }
      }
    });
  }

  render() {
    const { content } = this.state;

    return(
      <Card className={`reading ${this.props.classes}`} variant="outlined">
        <CardContent className="card-body">
          <div className="card-title mb-4">
            <h5>
              <PlainTextEditor
                content={content["reading-item-title"]}
                handleEditorChange={this.handleEditorChange("reading-item-title")}
              />
            </h5>
          </div>

          {
            content["reading-item-details"] &&
            <div className="post-details text-italic mb-3">
              <PlainTextEditor
                content={content["reading-item-details"]}
                handleEditorChange={this.handleEditorChange("reading-item-details")}
              />
            </div>
          }

          {
            content["reading-item-source"] &&
            <div className="post-details text-muted mb-3">
              <PlainTextEditor
                content={content["reading-item-source"]}
                handleEditorChange={this.handleEditorChange("reading-item-source")}
              />
            </div>
          }

          <div className="card-text mb-3" style={{ color: "#000000"}}>
            <PlainTextEditor
              content={content["reading-item-description"]}
              handleEditorChange={this.handleEditorChange("reading-item-description")}
            />
          </div>
        </CardContent>

        <CardActions>
          <div className="card-text mb-3" style={{ color: "#000000"}}>
            <LinkEditor
              content={content["reading-item-link"]}
              handleEditorChange={this.handleEditorChange("reading-item-link")}
              editAnchorText={false}
            />
          </div>
        </CardActions>
      </Card>
    )
  }
}

const Publication = props => {

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  return (
    <Editable
      Editor={PublicationEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <Card className={`reading-item ${props.classes}`} variant="outlined">
        <a href={content["reading-item-link"]["link"]} target="_blank" rel="noopener noreferrer">
          <CardContent className="card-body">
            <div className="card-title">
              <a href={content["reading-item-link"]["link"]} target="_blank" rel="noopener noreferrer">
                <h4 className="text-primary">
                  { content["reading-item-title"]["text"] }
                </h4>
              </a>
            </div>

            <p className="card-text" style={{ color: "#000000"}}>
              {content["reading-item-description"]["text"]}
            </p>

            {
              content["reading-item-details"] &&
              <div className="author">
                {content["reading-item-details"]["text"]}
              </div>
            }

            {
              content["reading-item-source"] &&
              <div>
                {content["reading-item-source"]["text"]}
              </div>
            }
          </CardContent>
        </a>
      </Card>
    </Editable>
  );
};

Publication.defaultProps = {
  content: {
    "reading-item-details": { "text": "Author, date" },
    "reading-item-title": { "text": "Publication title" },
    "reading-item-description": { "text": "Summary" },
    "reading-item-link": { "anchor": "link text", "link": "/" }
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default Publication;
