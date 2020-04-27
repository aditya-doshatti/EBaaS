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

import { Link, Redirect } from "react-router-dom";
import "chartist/dist/scss/chartist.scss";
import Swal from "sweetalert2";
import axios from 'axios'
import { AvForm, AvField } from "availity-reactstrap-validation";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: true,
      keys: [],
      information: null,
      deleted: false,
      error: null,
      tableName: null,
      columnName: null
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("connected")) {
      Swal.fire({
        title: 'Not connected to the database',
        text: 'You will not be able to add tables without connection',
        icon: 'warning',
        confirmButtonText: "Ok, let's connect",
      }).then((result) => {
        this.setState({
          connected: false
        })
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
          } else {
            console.log("error while creating")
            this.setState({
              error: "Internal Server Error while creating APIs"
            })
          }
        })
    }
  }

  handleTableChange = (e) => {
    console.log("Table selected is: ", e.target.value)
    this.setState({
      tableName: e.target.value
    })
  }

  handleColumnChange = (e) => {
    console.log("Column selected is: ", e.target.value)
    this.setState({
      columnName: e.target.value
    })
  }



  handleValidSubmit = (event, values) => {
    console.log("Valid Submit")
    event.preventDefault();
    const data = {
      hostname: localStorage.getItem("hostname"),
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
      database: localStorage.getItem("database"),
      tableName: this.state.tableName,
      columnName: this.state.columnName
    }

    axios.post("http://localhost:5000/deleteColumn", data)
      .then(response => {
        console.log("Got the response", response.data);
        if (response.status === 200) {
          Swal.fire({
            title: "Column removed successfully"
          }).then((result) => {
            this.setState({
              deleted: true
            })
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
  };

  handleInValidSubmit = (event, values) => {
    this.setState({
      error: "Invalid Form Values"
    });
  };

  render() {

    var redirect = null
    if (!this.state.connected) {
      redirect = <Redirect to="/connecttodatabase"></Redirect>
    }
    if (this.state.deleted) {
      redirect = <Redirect to="/viewDatabase"></Redirect>
    }
    var error = null
    if (this.state.error) {
      error = <p className="text-danger text-center">{this.state.error}</p>
    }

    var columnMenu = null
    if (this.state.information && this.state.tableName && this.state.information[this.state.tableName]) {
      console.log("Column selection should appear")
      columnMenu = <div className="form-group">
        <Row>
          <Col className="form-group">
            <Label for="formname">Column: </Label>
            <AvField type="select" name="column" className="form-control" onChange={this.handleColumnChange}
              validate={{ required: { value: true } }}
              errorMessage="Select the column"
            >
              <option selected>select</option>
              {this.state.information && this.state.information[this.state.tableName].map((key) => (
                <option value={key}>{key}</option>
              ))}
            </AvField>
          </Col>

        </Row>
      </div>
    }
    return (
      <React.Fragment>
        {redirect}
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Delete Column</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Modify Database</li>
                  <li className="breadcrumb-item active">Delete Column</li>
                </ol>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  {error}
                  <AvForm className="outer-repeater" onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInValidSubmit}>
                    <div data-repeater-list="outer-group" className="outer">
                      <div data-repeater-item className="outer">
                        <div className="form-group">
                          <Label for="formname">Database: </Label>
                          <Input
                            type="text"
                            id="database"
                            disabled="true"
                            placeholder={localStorage.getItem("database")}
                          />
                        </div>

                        <div className="form-group">
                          <Label for="formname">Table: </Label>
                          <AvField type="select" name="table" className="form-control" onChange={this.handleTableChange}
                            validate={{ required: { value: true } }}
                            errorMessage="Select the table again"
                          >
                            <option selected>select</option>
                            {this.state.keys.map((key) => (
                              <option value={key}>{key}</option>
                            ))}
                          </AvField>

                        </div>


                        {columnMenu}

                        <FormGroup className="mb-0">
                          <div>
                            <Button type="submit" color="danger" className="mr-1">
                              Delete
                                </Button>
                            <Button type="reset" color="secondary">
                              Cancel
                                </Button>
                          </div>
                        </FormGroup>
                      </div>
                    </div>
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

export default Dashboard;
