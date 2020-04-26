import React, { Component } from "react";


import {
    Row,
    Col,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap";
import Swal from 'sweetalert2'
import { Link, Redirect } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
// Custom Scrollbar



import "chartist/dist/scss/chartist.scss";
import axios from "axios";

class ViewDatabase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: true,
            information: false,
            keys: [],
            error: null
        };
    }

    componentDidMount() {
        if (!localStorage.getItem("connected")) {
            this.setState({
                connected: false
            })
        } else {
            const data = {
                hostname: localStorage.getItem("hostname"),
                username: localStorage.getItem("username"),
                password: localStorage.getItem("password"),
                database: localStorage.getItem("database"),
            }

            axios.post("http://localhost:5000/getInformation", data)
                .then(response => {
                    console.log("Got the response", response.data);
                    if (response.status === 200) {
                        let keys = Object.keys(response.data)
                        this.setState({
                            information: response.data,
                            keys: keys
                        })
                    }
                })
                .catch(error => {
                    if (error.response) {
                        // console.log("Register API error is: ", error.response.data)
                        this.setState({
                            error: error.response.data["error"]
                        })
                    }
                })
        }
    }

    onDisconnect = (e) => {
        localStorage.removeItem("connectionname")
        localStorage.removeItem("hostname")
        localStorage.removeItem("username")
        localStorage.removeItem("password")
        localStorage.removeItem("database")
        localStorage.setItem("connected", false)
        this.setState({
            connected: false
        })
    }

    render() {
        var redirect = null
        var linkToCreateTables = null
        var error = null
        if (this.state.error) {
            error = <p className="text-danger text-center">{this.state.error}</p>
        }
        if (!this.state.connected) {
            redirect = <Redirect to="/manageDatabase"></Redirect>
        }
        if (this.state.keys.length === 0) {
            linkToCreateTables = <Link to="/addnewtable" className="btn btn-primary">Add Tables</Link>
        }
        return (
            <React.Fragment>
                {redirect}
                <div className="container-fluid">
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <div className="page-title-box">
                                <h4 className="font-size-18">View Database</h4>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/#">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active">View Database</li>
                                </ol>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={12}>
                            {error}
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col lg={6}><h1 className="ml-1">Database: {localStorage.getItem("database")}</h1></Col>
                                        <Button type="reset" color="primary" className="m-1 ml-3" onClick={event => window.location.href = '/addnewtable'}>Add Table</Button>
                                        <Button type="reset" color="warning" className="m-1" onClick={this.onDisconnect}>Disconnect Database</Button>
                                
                                        {this.state.keys.map((key) => (
                                            <div className="col-lg-6">
                                            <div className="card">
                                              <div className="card-body">
                                              <h4 className="card-header mt-3"><center>{key}</center></h4>
                                                     <div className="card-body">
                                                         <p className="card-text">
                                                             <Row>
                                                                 {this.state.information[key].map((info) => (
                                                                     <Col md="3">
                                                                         <AvForm>
                                                                             <AvField
                                                                                 name="database"
                                                                                 type="text"
                                                                                 disabled="true"
                                                                                 value={info}
                                                                             />
                                                                         </AvForm>
                                                                     </Col>
                                                                 ))}
                                                             </Row>
                                                         </p>
                                                         <center><Link to="/addnewcolumn" className="btn btn-primary">
                                                             Add Columns
                                                             </Link></center>
                                                     </div>
                                              </div>
                                            </div>
                              
                                            
                                             
                                           
                                          </div>
                                        ))
                                        }

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

export default ViewDatabase;
