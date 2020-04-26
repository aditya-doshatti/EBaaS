import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Button, Input, FormGroup, Card, CardBody } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link, Redirect } from "react-router-dom";
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
import LineAreaChart from "../AllCharts/apex/lineareachart";
import RadialChart from "../AllCharts/apex/apexdonut";
import Apexdonut from "../AllCharts/apex/apexdonut1";
import SparkLine from "../AllCharts/sparkline/sparkline";
import SparkLine1 from "../AllCharts/sparkline/sparkline1";
import Salesdonut from "../AllCharts/apex/salesdonut";
import TopBar2 from "../../components/VerticalLayout/TopBar2";
import axios from 'axios'

import "chartist/dist/scss/chartist.scss";

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect:false,
      error:null
    };
  }

  handleValidSubmit = (event,values) => {
    const data = {
      userid:localStorage.getItem("userid"),
      name:values.name
    }
    axios.post("http://localhost:5000/application",data)
      .then(response => {
        console.log("CREATE NEW APPLICATION API RESPONSE IS: ",response.data)
        if(response.status===200){
          this.setState({
            redirect:true
          })
        }
      })
      .catch(error => {
        if(error.response){
          console.log("CREATE NEW APPLICATION API ERROR IS: ",error.response.data)
          this.setState({
            error:error.response.data["error"]
          })
        }
      })
  }

  render() {
    var redirect = null
    var error = null
    if(this.state.error){
      error = <p className="text-danger text-center">{this.state.error}</p>
    }
    if(this.state.redirect){
      redirect = <Redirect to="/home"></Redirect>
    }
    return (
      <React.Fragment>
      {redirect}
        <div className="container-fluid">
          <Row>
            <TopBar2></TopBar2>
          </Row>
          <br></br><br></br><br></br><br></br>
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Application Creator</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item active">
                    Application Details
                  </li>
                </ol>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
            <Card>
                <CardBody>
                {error}
                  <AvForm onValidSubmit={this.handleValidSubmit}>
                    <AvField
                      name="name"
                      label="Name"
                      type="text"
                      className="form-control"
                      placeholder="Eg. test"
                      errorMessage="Enter Application Name"
                      validate={{ required: { value: true } }}
                    />
                    <label>Description</label>
                    <AvField
                      name="description"
                      type="textarea"
                      placeholder="Describe the work"
                      className="form-control"
                    />
                    <label>Server</label>
                    <AvField
                      name="server"
                      type="text"
                      disabled="true"
                      placeholder="Eg. 127.0.0.1"
                      className="form-control"
                    />
                    <FormGroup className="mb-0">
                      <div>
                        <Button type="submit" color="primary" className="mr-1">
                          Create
                        </Button>
                        <Button type="reset" color="secondary">
                          Cancel
                        </Button>
                      </div>
                    </FormGroup>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Application;
