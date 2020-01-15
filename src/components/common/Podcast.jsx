import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import {
  PlainTextEditor,
  RichTextEditor,
  ImageUploadEditor,
  LinkEditor,
  Editable
} from 'react-easy-editables';

import { uploadImage } from "../../firebase/operations"

class PodcastEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: this.props.content };
  }

  handleEditorChange = field => item => {
    console.log("field", field)
    console.log("item", item)
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
      <Card className={`podcast-item ${this.props.classes}`} variant="outlined" square={true}>
        <CardContent className="card-body">
          <div className="image">
            <ImageUploadEditor
              content={content["podcast-item-image"]}
              handleEditorChange={this.handleEditorChange("podcast-item-image")}
              uploadImage={uploadImage}
            />
          </div>

          <div className="card-title">
            <h4 className="text-primary">
              <PlainTextEditor
                content={content["podcast-item-title"]}
                handleEditorChange={this.handleEditorChange("podcast-item-title")}
              />
            </h4>
          </div>

          <div className="author">
            <PlainTextEditor
              content={content["podcast-item-author"]}
              handleEditorChange={this.handleEditorChange("podcast-item-author")}
            />
          </div>

          <div className="card-text" style={{ color: "#000000"}}>
            <RichTextEditor
              content={content["podcast-item-description"]}
              handleEditorChange={this.handleEditorChange("podcast-item-description")}
            />
          </div>

          <div className="author">
            <PlainTextEditor
              EditorProps={{id: "podcast-item-published-date", type: "date"}}
              content={content["podcast-item-published-date"]}
              handleEditorChange={this.handleEditorChange("podcast-item-published-date")}
            />
          </div>

          <div className="author">
            <PlainTextEditor
              placeholder={"15 minutes"}
              content={content["podcast-item-length"]}
              handleEditorChange={this.handleEditorChange("podcast-item-length")}
            />
          </div>

          <div className="link" style={{ marginBottom: "1rem" }}>
            <LinkEditor
              content={content["podcast-item-link"]}
              handleEditorChange={this.handleEditorChange("podcast-item-link")}
              editCaption={false}
            />
          </div>
        </CardContent>
      </Card>
    )
  }
}

const Podcast = props => {

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  console.log("podcast content", content)

  return (
    <Editable
      Editor={PodcastEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <Card className={`podcast-item ${props.classes}`} variant="outlined" square={true}>
        <Grid container>
          <Grid item xs={12} sm={4}>
            <div className="media">
              <CardMedia
                style={{ height: "100%", width: "100%" }}
                image={content["podcast-item-image"]["imageSrc"]}
                title={content["podcast-item-image"]["caption"]}
              />
              <Button component={"a"} href={content["podcast-item-link"]["link"]} className="play-button">Play</Button>
            </div>
          </Grid>

          <Grid item xs={12} sm={8}>
            <CardContent className="card-body">
              <div className="card-title">
                <h4 className="underline">
                  { content["podcast-item-title"]["text"] }
                </h4>
              </div>

              <div className="author">
                {content["podcast-item-author"]["text"]}
              </div>

              <div className="description" dangerouslySetInnerHTML={ {__html: content["podcast-item-description"]["text"]} }>
              </div>

              <div className="details">
                <div><span className="bold">Published:</span>{content["podcast-item-published-date"]["text"]}</div>
                <div><span className="bold">Length:</span>{content["podcast-item-length"]["text"]}</div>
              </div>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Editable>
  );
};

Podcast.defaultProps = {
  content: {
    "podcast-item-author": { "text": "Author" },
    "podcast-item-title": { "text": "Title" },
    "podcast-item-description": { "text": "<p>Episode summary</p>" },
    "podcast-item-published-date": { "text": "yyyy-mm-dd" },
    "podcast-item-length": { "text": "Length" },
    "podcast-item-link": { "link": "/" },
    "podcast-item-image": { "imageSrc": "", "caption": "" },
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default Podcast;
