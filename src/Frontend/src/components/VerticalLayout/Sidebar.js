import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import MetisMenu from "metismenujs";

import SimpleBar from "simplebar-react";

const SidebarContent = props => {
  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">
        <li className="menu-title">Main</li>

        <li>
          <Link to="/dashboard" className="waves-effect">
            <i className="mdi mdi-home-outline"></i>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to="/manageDatabase" className=" waves-effect">
            <i className="mdi mdi-database"></i>
            <span>Manage Databases</span>
          </Link>
        </li>

        <li>
          <Link to="/viewDatabase" className=" waves-effect">
            <i className="mdi mdi-database"></i>
            <span>View Database</span>
          </Link>
        </li>
        <li>
          <Link to="/connecttodatabase" className=" waves-effect">
            <i className="mdi mdi-database-plus"></i>
            <span>Connect to Database</span>
          </Link>
        </li>

        <li>
          <Link to="/#" className="has-arrow waves-effect">
            <i className="mdi mdi-database-search"></i>
            <span>Modify Database</span>
          </Link>
          <ul className="sub-menu" aria-expanded="false">
            <li>
              <Link to="/addnewtable">Add New Table</Link>
            </li>
            <li>
              <Link to="/addnewcolumn">Add New Column</Link>
            </li>
            <li>
              <Link to="/modifycolumn">Modify a Column</Link>
            </li>
            <li>
              <Link to="/createrelationships">Create Relationships</Link>
            </li>
            <li>
              <Link to="/deletecolumn">Delete a Column</Link>
            </li>
            <li>
              <Link to="/deletetable">Delete a Table</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/calendar" className=" waves-effect">
            <i className="mdi mdi-file-document-box-search"></i>
            <span>View Logs</span>
          </Link>
        </li>
        <li>
          <Link to="/calendar" className=" waves-effect">
            <i className="mdi mdi-security"></i>
            <span>Security Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    if (this.props.type !== "condensed" || this.props.isMobile) {
      new MetisMenu("#side-menu");

      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        if (this.props.location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  activateParentDropdown = item => {
    item.classList.add("mm-active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active"); // li
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        {this.props.type !== "condensed" ? (
          <SimpleBar style={{ maxHeight: "100%" }}>
            <SidebarContent />
          </SimpleBar>
        ) : (
          <SidebarContent />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Sidebar);
