import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownToggle
} from "reactstrap";

// import images
import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";

// Import other Dropdown
import ProfileMenu from "../ProfileMenu";

class TopBar2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchOpen: false
    };

    
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  
  }


  /**
   * Toggle full screen
   */
  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link to="/dashboard" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logodarkImg} alt="" height="65" />
                  </span>
                </Link>

                <Link to="/dashboard" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logolightImg} alt="" height="65" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="d-flex">
              <ProfileMenu />
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

export default TopBar2;
