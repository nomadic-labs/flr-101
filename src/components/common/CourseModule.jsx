import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from "gatsby"


const CourseModule = ({ page, order }) => {

  return (
    <Card variant="outlined" square={true} key={page.slug} className="my-20">
      <Grid container>
        <Grid item xs={8}>
          <CardContent className="card-body">
            <p>{`Module ${order}`}</p>
            <h3>{page.title}</h3>
          </CardContent>
          <CardActions>
            <Button component={Link} to={page.slug} variant="contained">Start now</Button>
          </CardActions>
        </Grid>

        <Grid item xs={4}>
          <CardMedia />
        </Grid>
      </Grid>
    </Card>
  );
};

export default CourseModule;
