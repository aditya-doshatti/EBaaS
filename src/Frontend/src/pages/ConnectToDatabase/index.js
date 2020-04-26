import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import classnames from "classnames";

import { Link, Redirect } from "react-router-dom";
// Custom Scrollbar



import "chartist/dist/scss/chartist.scss";
import CreateForm from "./CreateForm";
import ExistingForm from "./ExistingForm";
import ExcelForm from "./ExcelForm";
import SqlForm from "./SqlForm";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab1: "5",
      selectedFiles: [],
      connected:false
    };
    this.toggle1 = this.toggle1.bind(this);
    this.handleAcceptedFiles = this.handleAcceptedFiles.bind(this);
  }


  componentDidMount(){
    if(localStorage.getItem("connected") === false){
        this.setState({
            connected:false 
        })
    }
}

  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab
      });
    }
  }

  handleAcceptedFiles = files => {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: this.formatBytes(file.size)
      })
    );

    this.setState({ selectedFiles: files });
  };

  /**
   * Formats the size
   */
  formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };


  render() {
    var redirect = null
        if(this.state.connected){
            redirect = <Redirect to="/viewDatabase"></Redirect>
        }
    return (
      <React.Fragment>
      {redirect}
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Connect to Database</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Connect to Database</li>
                </ol>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <div className="card">
                <div className="card-body">
                  <Nav pills className="navtab-bg nav-justified">
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab1 === "5"
                        })}
                        onClick={() => {
                          this.toggle1("5");
                        }}
                      >
                        Create a New Database<br></br>(Coming Soon)
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab1 === "6"
                        })}
                        onClick={() => {
                          this.toggle1("6");
                        }}
                      >
                        Connect to Existing Database
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab1 === "7"
                        })}
                        onClick={() => {
                          this.toggle1("7");
                        }}
                      >
                        Upload Excel<br></br>(Coming Soon)
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab1 === "8"
                        })}
                        onClick={() => {
                          this.toggle1("8");
                        }}
                      >
                        Upload SQL<br></br>(Coming Soon)
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={this.state.activeTab1}>
                    <TabPane tabId="5" className="p-3">
                      <Row>
                        <Col sm="12">
                          <CreateForm></CreateForm>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="6" className="p-3">
                      <Row>
                        <Col sm="12">
                          <ExistingForm></ExistingForm>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="7" className="p-3">
                      <Row>
                        <Col sm="12">
                          <ExcelForm></ExcelForm>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="8" className="p-3">
                      <Row>
                        <Col sm="12">
                          <SqlForm></SqlForm>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
