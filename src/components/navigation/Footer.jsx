import React from "react";
import { StaticQuery, graphql, Link } from "gatsby"
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Menu from "@material-ui/core/Menu";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import MenuIcon from '@material-ui/icons/Menu';
import LanguageIcon from '@material-ui/icons/Language';
import ShareIcon from '@material-ui/icons/Share';
import DownloadIcon from '@material-ui/icons/GetApp';

import PopupNavigation from "./PopupNavigation"
import logo from "../../assets/images/nawl-logo.svg"

import { LANGUAGE_OPTIONS } from "../../utils/constants"

class Footer extends React.Component {
  state = {
    anchorEl: null,
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
        <Hidden smDown>
          <Container maxWidth="lg">
            <Grid container>
              <Grid item xs={6} md={5} className="footer-left">
                <Button
                  onClick={openMenu}
                  aria-owns={anchorEl ? "toc" : null}
                  aria-haspopup="true"
                >
                  <KeyboardArrowUp style={{ marginRight: '0.5rem'}}/>Table of Contents
                </Button>
              </Grid>
              <Grid item xs={6} md={2} className="footer-center">
                <Grid container justify="center" alignItems="center">
                  <Button className="logo" component="a" href="https://nawl.ca/">
                    <img src={logo} alt="NAWL | ANFD" />
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12} md={5} className="align-right footer-right">
                <Button>Share</Button>
                <Button>Download syllabus</Button>
                {
                  Object.keys(translations).map(key => {
                    if (translations[key]) {
                      const language = LANGUAGE_OPTIONS.find(o => o.value === key) || {}
                      return(
                        <Button key={key} component={"a"} href={translations[key].slug}>
                          {language.label}
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
        </Hidden>
        <Hidden mdUp>
          <BottomNavigation
            showLabels
          >
            <BottomNavigationAction
              label="Contents"
              icon={<MenuIcon />}
              onClick={openMenu}
              aria-owns={anchorEl ? "toc" : null}
              aria-haspopup="true"
            />
            <BottomNavigationAction label="Share" icon={<ShareIcon />} />
            <BottomNavigationAction label="Download" icon={<DownloadIcon />} />
            {
              Object.keys(translations).map(key => {
                if (translations[key]) {
                  const language = LANGUAGE_OPTIONS.find(o => o.value === key) || {}
                  console.log("translations[key]", translations[key])
                  return(
                    <BottomNavigationAction key={key} component={Link} linkButton={true} to={translations[key].slug} label={language.label} icon={<LanguageIcon />} />
                  )
                } else {
                  return null
                }
              })
            }
          </BottomNavigation>
        </Hidden>
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
