import React from "react";
import { Link } from "gatsby"
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Menu from "@material-ui/core/Menu";
import Popover from "@material-ui/core/Popover";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import MenuIcon from '@material-ui/icons/Menu';
import LanguageIcon from '@material-ui/icons/Language';
import ShareIcon from '@material-ui/icons/Share';
// import DownloadIcon from '@material-ui/icons/GetApp';

import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';


import PopupNavigation from "./PopupNavigation"
import T from "../common/Translation"

import logo from "../../assets/images/nawl-logo.svg"

import { LANGUAGE_OPTIONS } from "../../utils/constants"

const isClient = typeof window !== 'undefined';

class Footer extends React.Component {
  state = {
    anchorEl: null,
    shareAnchor: null,
  };

  openMenu = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  closeMenu = e => {
    this.setState({ anchorEl: null });
  };

  openShareButtons = e => {
    this.setState({ shareAnchor: e.currentTarget });
  };

  closeShareButtons = e => {
    this.setState({ shareAnchor: null });
  };

  render() {
    const { props, openMenu, closeMenu, openShareButtons, closeShareButtons } = this;
    const { anchorEl, shareAnchor } = this.state;
    const translations = props.pageData ? props.pageData.translations || {} : {}
    const shareUrl = props.location ? props.location.href : isClient ? window.location.origin : "";
    const shareTitle = props.pageData ? props.pageData.title : "Feminist Law Reform 101"

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
          <PopupNavigation />
        </Menu>
        <Popover
          id="share-buttons"
          role="menu"
          anchorEl={shareAnchor}
          open={Boolean(shareAnchor)}
          onClose={closeShareButtons}
          className="share-buttons-menu"
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
          <Card variant="outlined" className="share-buttons-popover">
            <CardContent style={{ padding: "0.5rem" }}>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={36} round />
              </TwitterShareButton>

              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={36} round />
              </FacebookShareButton>

              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <LinkedinIcon size={36} round />
              </LinkedinShareButton>

              <EmailShareButton url={shareUrl} subject={shareTitle}>
                <EmailIcon size={36} round />
              </EmailShareButton>
            </CardContent>
          </Card>
        </Popover>
        <Hidden smDown>
          <Container maxWidth="lg">
            <Grid container>
              <Grid item xs={6} md={5} className="footer-section footer-left">
                <Button
                  onClick={openMenu}
                  aria-owns={anchorEl ? "toc" : null}
                  aria-haspopup="true"
                >
                  <KeyboardArrowUp style={{ marginRight: '0.5rem'}}/>
                  <T id="table_of_contents" />
                </Button>
              </Grid>
              <Grid item xs={6} md={2} className="footer-section footer-center">
                <Grid container justify="center" alignItems="center">
                  <Button className="logo" component="a" href="https://nawl.ca/">
                    <img src={logo} alt="NAWL | ANFD" />
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12} md={5} className="footer-section align-right footer-right">
                <Button
                  onClick={openShareButtons}
                  aria-owns={shareAnchor ? "share-buttons" : null}
                  aria-haspopup="true"
                >
                  <T id="share" />
                </Button>
                {/*<Button><T id="download_syllabus" /></Button>*/}
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
              label={<T id="table_of_contents" />}
              icon={<MenuIcon />}
              onClick={openMenu}
              aria-owns={anchorEl ? "toc" : null}
              aria-haspopup="true"
            />
            <BottomNavigationAction label={<T id="share" />} icon={<ShareIcon />} />
            {/*<BottomNavigationAction label={<T id="download_syllabus" />} icon={<DownloadIcon />} />*/}
            {
              Object.keys(translations).map(key => {
                if (translations[key]) {
                  const language = LANGUAGE_OPTIONS.find(o => o.value === key) || {}
                  return(
                    <BottomNavigationAction key={key} component={Link} to={translations[key].slug} label={language.label} icon={<LanguageIcon />} />
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

export default Footer;
