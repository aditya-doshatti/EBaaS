import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Button, Input, FormGroup, Card, CardBody } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
// Custom Scrollbar
import SimpleBar from "simplebar-react";


// import images
import servicesIcon1 from "../../assets/images/services-icon/01.png";
import servicesIcon2 from "../../assets/images/services-icon/02.png";
import servicesIcon3 from "../../assets/images/services-icon/03.png";
import servicesIcon4 from "../../assets/images/services-icon/04.png";
import user2 from "../../assets/images/users/user-2.jpg";
import user3 from "../../assets/images/users/user-3.jpg";
import user4 from "../../assets/images/users/user-4.jpg";
import user5 from "../../assets/images/users/user-5.jpg";
import user6 from "../../assets/images/users/user-6.jpg";
import smimg1 from "../../assets/images/small/img-1.jpg";
import smimg2 from "../../assets/images/small/img-2.jpg";

// Charts


import "chartist/dist/scss/chartist.scss";
import axios from 'axios'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:null,
      description:null,
      server:null
    };
  }

  componentDidMount(){
    axios.get("http://localhost:5000/application/"+localStorage.getItem("applicationid"))
      .then(response => {
        console.log("GET APPLICATION API RESPONSE IS: ",response.data)
        if(response.status === 200){
          this.setState({
            name:response.data["name"],
            description:response.data["description"],
            server:response.data["server"]
          })
        }
      })
      .catch(error => {
        if(error.response){
          // console.log("Register API error is: ", error.response.data)
          this.setState({
            error:error.response.data["error"]
          })
        }
      })
  }


  handleValidSubmit = (event,values) => {
    console.log("Valid Submit")
    if(!values.connection || !values.database){
      console.log("inside if")
      this.setState({
        error:"Connect to a database first"
      })
    }else{
      const data = {
        project:this.state.name,
        hostname:localStorage.getItem("hostname"),
        username:localStorage.getItem("username"),
        password:localStorage.getItem("password"),
        database:localStorage.getItem("database"),

      }
      axios.post("http://localhost:5000/launch",data)
        .then(response => {
          console.log("LAUNCH API RESPONSE IS: ",response.data)
          if(response.status === 200){
            axios.post("http://localhost:5000/zip/"+this.state.name)
              .then(response => {
                console.log("ZIP APPLICATION RESPONSE IS: ",response.data)
                if(response.status === 200){
                  this.setState({
                    download:true
                  })
                }
              })
              .catch(error => {
                if(error.response){
                  // console.log("Register API error is: ", error.response.data)
                  this.setState({
                    error:error.response.data["error"]
                  })
                }
              })
          }
        })
        .catch(error => {
          if(error.response){
            // console.log("Register API error is: ", error.response.data)
            this.setState({
              error:error.response.data["error"]
            })
          }
        })
    }
  }

  render() {
    var download = null
    if(this.state.download){
            console.log("Download should start")
            download = 
                    <Button
                      color="primary"
                      className="btn btn-primary btn-lg btn-block waves-effect waves-light mt-2"
                      href={"http://localhost:5000/zip/"+this.state.name}
                    >Download</Button>    
    }
    var error = null
    if(this.state.error){
      console.log("Error should be printed")
      error = <p className="text-center text-danger">{this.state.error}</p>
    }
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Dashboard</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item active">
                    Application Details
                  </li>
                </ol>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xl={7}>
            <Card>
                <CardBody>
                {error}
                  <AvForm onValidSubmit={this.handleValidSubmit}>
                    <AvField
                      name="applicationname"
                      label="Name"
                      value={this.state.name}
                      type="text"
                      disabled="true"
                      errorMessage="Enter Application Name"
                      validate={{ required: { value: true } }}
                    />
                    <label>Description</label>
                    <AvField
                      name="description"
                      type="textarea"
                      value={this.state.description}
                    />
                    <label>Selected Connection</label>
                    <AvField
                      name="connection"
                      type="text"
                      disabled="true"
                      value={localStorage.getItem("connectionname")}
                    />
                    <label>Selected Database</label>
                    <AvField
                      name="database"
                      type="text"
                      disabled="true"
                      value={localStorage.getItem("database")}
                    />
                    <label>Server</label>
                    <AvField
                      name="server"
                      type="text"
                      disabled="true"
                      defaultValue={this.state.server}
                    />
                    <FormGroup className="mb-0">
                      <div>
                      <Row className="mb-2">
                      <Col lg="4">
                        <Button type="submit" color="success" className="mr-1" style={{ width: "100%" }}>
                          Launch
                        </Button>
                        </Col>
                        <Col lg="4">
                        <Button type="reset" color="secondary" className="mr-1" style={{ width: "100%" }}>
                          Cancel
                        </Button>
                        </Col>
                        <Col lg="4">
                        <Button color="dark" className="mr-1" onClick={event =>  window.location.href='/home'} style={{ width: "100%" }}> Exit </Button>
                        </Col>
                        </Row>
                        {download}
                      </div>
                    </FormGroup>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>

            <Col xl={5}>
              <Card>
                <CardBody>
                  <div>
                    <h4 className="card-title mb-4">Application Name</h4>
                  </div>
                  <div className="wid-peity mb-4">
                    <div className="row">
                      <div className="col-md-12">
                          <p className="text-muted">Created by</p>
                          <h5 className="mb-3">{localStorage.getItem("name")}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="wid-peity mb-4">
                    <div className="row">
                      <div className="col-md-12">
                          <p className="text-muted">Created on</p>
                          <h5 className="mb-3">Time stamp</h5>
                      </div>
                    </div>
                  </div>
                  <div className="wid-peity mb-4">
                    <div className="row">
                      <div className="col-md-12">
                          <p className="text-muted">Last Modified on</p>
                          <h5 className="mb-3">Time stamp</h5>
                      </div>
                    </div>
                  </div>
                  <div className="wid-peity mb-4">
                    <div className="row">
                      <div className="col-md-12">
                          <p className="text-muted">Last Exported at</p>
                          <h5 className="mb-3">Time stamp</h5>
                      </div>
                    </div>
                  </div>
                  <div className="wid-peity mb-4">
                    <div className="row">
                      <div className="col-md-12">
                          <p className="text-muted">Last Hosted at</p>
                          <h5 className="mb-3">Time stamp</h5>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
