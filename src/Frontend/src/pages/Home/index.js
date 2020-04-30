import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Button, Input, FormGroup, Card, CardBody } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link, Redirect } from "react-router-dom";
// Custom Scrollbar


import "chartist/dist/scss/chartist.scss";
import TopBar2 from "../../components/VerticalLayout/TopBar2";
import axios from 'axios'
import {BASE_URL} from '../../config'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            error: null,
            redirect:false
        };
    }

    componentDidMount() {
        axios.get(BASE_URL + "/application/user/" + localStorage.getItem("userid"))
            .then(response => {
                console.log("GET APPLICATIONS OF USER REPONSE IS: ", response.data)
                if (response.status === 200) {
                    this.setState({
                        applications: response.data
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

    handleApplicationOpen = (event) =>{
        console.log("Id is: ",event.target.id)
        localStorage.setItem("applicationid",event.target.id)
        this.setState({
            redirect:true
        })
    }
    render() {
        var redirect = null
        if(this.state.redirect){
            redirect = <Redirect to="/dashboard"></Redirect>
        }
        var error = null
        if(this.state.error){
            error = <p className="text-danger text-center">{this.state.error}</p>
        }
        return (
            <React.Fragment>
            {redirect}
                <div className="container-fluid">
                    <Row>
                        <TopBar2 />
                    </Row>
                    <br></br><br></br><br></br><br></br>
                    <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h2 className="font-size-34">Hello, {localStorage.getItem("name")}</h2>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item active">
                  <h2 className="font-size-18">Below are your already made applications</h2>
                  </li>
                </ol>
                {error}
              </div>
            </Col>
          </Row>
          </div>
                    {/* <Row>
                        <p>Hello, {localStorage.getItem("name")}</p><br></br>
                    </Row>
                    <Row>
                        <p>Below are your already made applications</p>
                        {error}
                    </Row> */}
                    <Row className="align-items-center">
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <div class="col-xl-12">
                                        <div class="card">
                                            <div class="card-body">
                                                <h4 class="card-title mb-4">Applications</h4>
                                                <div class="table-responsive mb-0" data-pattern="priority-columns">
                                                    <table class="table table-hover table-centered table-nowrap mb-0" className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Application ID</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Description</th>
                                                                <th scope="col">Server</th>
                                                                <th scope="col" >Status</th>
                                                                <th scope="col" >Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.applications.map(application => (
                                                                <tr>
                                                                    <th scope="row">{application["id"]}</th>
                                                                    <td>{application["name"]}</td>
                                                                    <td>{application["description"]}</td>
                                                                    <td>{application["server"]}</td>
                                                                    <td><span  class={application["launched"] ? "badge badge-success" : "badge badge-danger"}>{application["launched"]?"Launched":"Not Launched"}</span></td>
                                                                    <td><Button  style={{ width: "80%" }} color="success" class="btn btn-primary m-2" onClick={this.handleApplicationOpen} id={application["id"]}>Open</Button></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Row className="align-items-center">
  
                                        <Button type="submit" color="primary" className="mr-1" onClick={event =>  window.location.href='/addapplication'}>
                                        Create a new application
                                            </Button>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </React.Fragment>
        );
    }
}

export default Home;
