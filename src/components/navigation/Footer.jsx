import React from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'



const Footer = (props) => {
  return (
    <footer>
      <nav className="navbar">
        <Container maxWidth="md">
          <Grid container>
            <Grid item xs={4} className="footer-left">
              <Button><KeyboardArrowUp style={{ marginRight: '0.5rem'}}/>Table of Contents</Button>
            </Grid>
            <Grid item xs={8} className="align-right footer-right">
              <Button>Share</Button>
              <Button>Download syllabus</Button>
            </Grid>
          </Grid>
        </Container>

      </nav>
    </footer>
  );
}

export default Footer;
