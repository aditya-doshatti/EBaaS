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
import {BASE_URL} from '../../config'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: true,
      information: null,
      keys: [],
      remainingKeys: [],
      table1: false,
      table2: false,
      table2Column: false,
      ForeignKeyName: false,
      error: null,
      added: null
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

      axios.post(BASE_URL + "/getInformation", data)
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

  handleTable1Change = (e) => {
    console.log("Table1 selected is: ", e.target.value)
    var remainingKeys = this.state.keys.filter(function (key) {
      return key != e.target.value
    })
    this.setState({
      table1: e.target.value,
      remainingKeys: remainingKeys
    })
  }

  handleTable2Change = (e) => {
    console.log("Table2 selected is: ", e.target.value)
    this.setState({
      table2: e.target.value
    })
  }

  handleColumn1Change = (e) => {
    console.log("Column1 selected is: ", e.target.value)
    this.setState({
      ForeignKeyName: e.target.value
    })
  }

  handleColumn2Change = (e) => {
    console.log("Column2 selected is: ", e.target.value)
    this.setState({
      table2Column: e.target.value
    })
  }


  handleValidSubmit = (event, values) => {
    console.log("Valid Submit")
    console.log("State is: ", this.state)

    event.preventDefault();
    const data = {
      hostname: localStorage.getItem("hostname"),
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
      database: localStorage.getItem("database"),
      table1:this.state.table1,
      table2:this.state.table2,
      ForeignKeyName:this.state.ForeignKeyName,
      table2Column:this.state.table2Column,
    }

    axios.post(BASE_URL + "/addRelationShip", data)
      .then(response => {
        console.log("Got the response", response.data);
        if (response.status === 200) {
          Swal.fire({
            title: "Relationship added successfully"
          }).then((result) => {
            this.setState({
              name: "",
              type: "",
              columns: [{ name: "", type: "" }],
              added: true
            })
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
    if (this.state.added) {
      redirect = <Redirect to="/viewDatabase"></Redirect>
    }
    var error = null
    if (this.state.error) {
      error = <p className="text-danger text-center">{this.state.error}</p>
    }

    var table1ColumnMenu = null
    if (this.state.information && this.state.table1 && this.state.information[this.state.table1]) {
      table1ColumnMenu = <Col lg="5" className="form-group">
        <Label for={"Choose " + this.state.table1 + " column"}>{"Choose " + this.state.table1 + " column"}</Label>
        <AvField type="select" name="ForeignKeyName" className="form-control" onChange={this.handleColumn1Change}
          validate={{ required: { value: true } }}
          errorMessage="Select the column"
        >
          <option selected>select</option>
          {this.state.information[this.state.table1].map((key) => (
            <option value={key}>{key}</option>
          ))}
        </AvField>
      </Col>
    }

    var table2Menu = null
    if (this.state.information && this.state.table1 && this.state.remainingKeys) {
      table2Menu = <Col lg="5" className="form-group">
        <Label for="name">Table 2</Label>
        <AvField type="select" name="table2" className="form-control" onChange={this.handleTable2Change}
          validate={{ required: { value: true } }}
          errorMessage="Select table 2"
        >
          <option selected>select</option>
          {this.state.remainingKeys.map((key) => (
            <option value={key}>{key}</option>
          ))}
        </AvField>
      </Col>
    }

    var table2ColumnMenu = null
    if (this.state.information && this.state.table2 && this.state.information[this.state.table2]) {
      table2ColumnMenu = <Col lg="5" className="form-group">
        <Label for={"Choose " + this.state.table2 + " column"}>{"Choose " + this.state.table2 + " column"}</Label>
        <AvField type="select" name="table2Column" className="form-control" onChange={this.handleColumn2Change}
          validate={{ required: { value: true } }}
          errorMessage="Select the column"
        >
          <option selected>select</option>
          {this.state.information[this.state.table2].map((key) => (
            <option value={key}>{key}</option>
          ))}
        </AvField>
      </Col>
    }

    return (
      <React.Fragment>
        {redirect}
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Add New Column</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Modify Database</li>
                  <li className="breadcrumb-item active">Add New Column</li>
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
                          <AvField type="select" name="table1" className="form-control" onChange={this.handleTable1Change}
                            validate={{ required: { value: true } }}
                            errorMessage="Select the table again"
                          >
                            <option selected>select</option>
                            {this.state.keys.map((key) => (
                              <option value={key}>{key}</option>
                            ))}
                          </AvField>
                        </div>
                        <div className="inner-repeater mb-4">


                          <Row>
                            <Col lg="5" className="form-group">
                              <Label for="name">Table 1</Label>
                              <AvField
                                name="table1"
                                className="inner form-control"
                                disabled
                                type="text"
                                errorMessage="Please select the Table 1"
                                value={this.state.table1}
                                validate={{ required: { value: true } }}
                              />
                            </Col>

                            {table1ColumnMenu}
                          </Row>

                          <Row>
                            {table2Menu}
                            {table2ColumnMenu}

                          </Row>



                        </div>

                        <FormGroup className="mb-0">
                          <div>
                            <Button type="submit" color="primary" className="mr-1">
                              Save
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
