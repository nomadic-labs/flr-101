import React from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import { Link, StaticQuery } from "gatsby"


class Footer extends React.Component {
  state = {
    anchorEl: null
  };

  openMenu = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  closeMenu = e => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { props, openMenu, closeMenu } = this;
    const { anchorEl } = this.state;
    const translations = props.pageData ? props.pageData.translations || {} : {}
    console.log("props", props)

    return (
      <footer>
        <nav className="navbar">
          <Container>
            <Grid container>
              <Grid item xs={4} className="footer-left">
                <Button
                  onClick={openMenu}
                  aria-owns={anchorEl ? "toc" : null}
                  aria-haspopup="true"
                >
                  <KeyboardArrowUp style={{ marginRight: '0.5rem'}}/>Table of Contents
                </Button>
                <Menu
                  id="toc"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  anchorOrigin={{ horizontal: "left", vertical: "top" }}
                  className="table-of-contents"
                >
                  <MenuItem component={Link} to={"/"}>
                    Home page
                  </MenuItem>

                  <MenuItem component={Link} to={"/en/why-a-course-in-feminist-law-reform"}>
                    Module 1: Course Guide
                  </MenuItem>
                </Menu>
              </Grid>
              <Grid item xs={8} className="align-right footer-right">
                <Button>Share</Button>
                <Button>Download syllabus</Button>
                {
                  Object.keys(translations).map(key => {
                    if (translations[key]) {
                      return(
                        <Button key={key} component={Link} to={translations[key].slug}>
                          {key.toUpperCase()}
                        </Button>
                      )
                    }
                  })
                }
              </Grid>
            </Grid>
          </Container>

        </nav>
      </footer>
    );
  }
}

const FooterContainer = props => (
  <StaticQuery
    query={graphql`
      query {
        allPages {
          edges {
            node {
              id
              title
              slug
              lang
              category
            }
          }
        }
      }
    `}
    render={data => {
      return(
        <Footer data={data} {...props} />
      )
    }}
  />
)

export default FooterContainer;
