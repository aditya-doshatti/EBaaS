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


import axios from 'axios'

class ManageDatabase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            databases: [],
            redirect:false,
            error:null
        };
    }

    componentDidMount(){
        axios.get("http://localhost:5000/database/user/"+localStorage.getItem("userid"))
            .then(response => {
                console.log("GET USER DATABASES API RESPONSE IS: ",response.data)
                if(response.status === 200){
                    this.setState({
                        databases:response.data
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

    handleDatabaseConnect = (event) => {
        console.log("databse id is: ",event.target.id)
        axios.get("http://localhost:5000/database/"+event.target.id)
            .then(response => {
                console.log("GET DATABASE DETAILS API RESPONSE IS: ",response.data)
                if(response.status === 200){
                    const data = {
                        hostname:response.data["hostname"],
                        username:response.data["username"],
                        password:response.data["password"],
                        database:response.data["dbname"]
                    }
                    axios.post("http://localhost:5000/connectToDatabase",data)
                        .then(response2 => {
                            console.log("CONNECT TO DATABASE API RESPONSE IS: ",response2.data)
                            if(response.status === 200){
                                localStorage.setItem("hostname",response.data["hostname"])
                                localStorage.setItem("username",response.data["username"])
                                localStorage.setItem("password",response.data["password"])
                                localStorage.setItem("database",response.data["dbname"])
                                localStorage.setItem("connectionname",response.data["connectionname"])
                                localStorage.setItem("connected",true)
                                this.setState({
                                    redirect:true
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

    onDisconnect = (e) => {
        localStorage.removeItem("connectionname")
        localStorage.removeItem("hostname")
        localStorage.removeItem("username")
        localStorage.removeItem("password")
        localStorage.removeItem("database")
        localStorage.setItem("connected",false)
        this.setState({
            connected: false
        })
    }

    render() {
        var redirect = null
        if(this.state.redirect){
            redirect = <Redirect to="/viewDatabase"></Redirect>
        }
        var error = null
        if(this.state.error){
            error = <p className="text-danger text-center">{this.state.error}</p>
        }
        var connectToDatabase = null
        if(localStorage.getItem("connected")!="true"){
            connectToDatabase = <Button type="submit" color="primary" className="mr-1" onClick={event =>  window.location.href='/connecttodatabase'}>
                                    Connect to a new database
                                </Button>
        }
        return (
            <React.Fragment>
            {redirect}
                <div className="container-fluid">
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <div className="page-title-box">
                                <h4 className="font-size-18">Manage Databases</h4>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item active">
                                        Database Details
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
                                    <h4 class="card-title mb-4">Databases</h4>
                                    <div class="table-responsive">
                                        <table class="table table-hover table-centered table-nowrap mb-0" className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Database ID</th>
                                                    <th scope="col">Connection Name</th>
                                                    <th scope="col">Hostname</th>
                                                    <th scope="col">Username</th>
                                                    <th scope="col">Password</th>
                                                    <th scope="col">DB-Name</th>
                                                    <th scope="col"> Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.databases.map(database => (
                                                    <tr>
                                                        <th scope="row">{database["id"]}</th>
                                                        <td>{database["connectionname"]}</td>
                                                        <td>{database["hostname"]}</td>
                                                        <td>{database["username"]}</td>
                                                        <td>{database["password"]}</td>
                                                        <td>{database["dbname"]}</td>
                                                        {
                                                            localStorage.getItem("connectionname") === database["connectionname"] ? (
                                                                [
                                                                <td><Button  color="success" class="btn btn-primary m-2" onClick={this.handleDatabaseConnect} id={database["id"]} disabled>Connected</Button>
                                                                <Button  color="warning" className="btn btn-primary m-2" onClick={this.onDisconnect}>Disconnect</Button></td>
                                                                ]
                                                                ) : (
                                                                    [
                                                                <td><Button  color="success"  class="btn btn-primary m-2" onClick={this.handleDatabaseConnect} id={database["id"]}>Connect</Button>
                                                                <Button  color="warning" className="btn btn-primary m-2" onClick={this.onDisconnect} disabled>Disconnected</Button></td>
                                                                    ]
                                                                )
                                                        }    
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {connectToDatabase}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default ManageDatabase;
