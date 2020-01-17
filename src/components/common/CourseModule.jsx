import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from "gatsby"


const CourseModule = ({ page, order }) => {
  return (
    <Card variant="outlined" square={true} key={page.slug} className="my-20 course-module">
      <Grid container>
        <Grid item xs={12}>
          <CardContent className="card-body">
            <p>{`Module ${order}`}</p>
            <h3>{page.title}</h3>
          </CardContent>
          <CardActions className="card-actions">
            <Button component={Link} to={page.slug} variant="contained" className="flr-btn">Start now</Button>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CourseModule;
