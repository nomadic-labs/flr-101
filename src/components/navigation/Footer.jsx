import React from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Menu from "@material-ui/core/Menu";
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import { StaticQuery, graphql } from "gatsby"

import PopupNavigation from "./PopupNavigation"
import logo from "../../assets/images/nawl-logo.svg"

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
    return (
      <footer>
        <Container maxWidth="lg">
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
                role="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                className="table-of-contents"
                elevation={0}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <PopupNavigation pageData={props.pageData}/>
              </Menu>
            </Grid>
            <Grid item xs={4} className="align-right footer-right">
              <Grid container justify="center" alignItems="center">
                <Button className="logo" component="a" href="https://nawl.ca/">
                  <img src={logo} alt="NAWL | ANFD" />
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={4} className="align-right footer-right">
              <Button>Share</Button>
              <Button>Download syllabus</Button>
              {
                Object.keys(translations).map(key => {
                  if (translations[key]) {
                    return(
                      <Button key={key} component={"a"} href={translations[key].slug}>
                        {key.toUpperCase()}
                      </Button>
                    )
                  } else {
                    return null
                  }
                })
              }
            </Grid>
          </Grid>
        </Container>
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
