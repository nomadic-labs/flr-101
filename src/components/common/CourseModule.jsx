import React from "react";
import PropTypes from "prop-types";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


const CourseModule = props => {

  return (
    <Card className={`podcast-item ${props.classes}`} variant="outlined" square={true}>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <div className="media">
            <CardMedia
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
  );
};

CourseModule.defaultProps = {}

export default CourseModule;
