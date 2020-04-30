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
      keys: [],
      name: "",
      type: "",
      columns: [{ name: "", type: "" }],
      tableName:false,
      error:null
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
      tableName:e.target.value
    })
  }

  handleColumnNameChange = idx => evt => {
    const newColumns = this.state.columns.map((column, sidx) => {
      if (idx !== sidx) return column;
      return { ...column, name: evt.target.value };
    });

    this.setState({ 
      columns: newColumns 
    },() => {
      console.log("State in Name Change: ",this.state.columns)
    });

  };

  handleColumnTypeChange = idx => evt => {
    const newColumns = this.state.columns.map((column, sidx) => {
      if (idx !== sidx) return column;
      return { ...column, type: evt.target.value };
    });

    this.setState({ 
      columns: newColumns 
    },() => {
      console.log("State in Name Change: ",this.state.columns)
    });

  };

  handleAddRowNested = () => {
    this.setState({
      columns: this.state.columns.concat([{ name: "" ,type: ""}])
    },()=>{
      console.log("After adding a new row",this.state.columns)
    });
  };


  handleRemoveRowNested = idx => () => {
    this.setState({
      columns: this.state.columns.filter((s, sidx) => idx !== sidx)
    },() => {
      console.log("After removing a row",this.state.columns)
    });
  };

  handleValidSubmit = (event,values) => {
    console.log("Valid Submit")
    if(!this.state.tableName){
      Swal.fire({
        title: 'No Table Selected',
        confirmButtonText: "Ok, select"
      })
    }else{
      event.preventDefault();
      const data = {
        hostname:localStorage.getItem("hostname"),
        username:localStorage.getItem("username"),
        password:localStorage.getItem("password"),
        database:localStorage.getItem("database"),
        tableName:this.state.tableName,
    }
    
    axios.post(BASE_URL + "/deleteTable",data)
        .then(response => {
            console.log("Got the response",response.data);
            if(response.status === 200){
                Swal.fire({
                  title:"Table Deleted Successfully"
                }).then((result)=>{
                  this.setState({
                    name: "",
                    type: "",
                    columns: [{ name: "" ,type: ""}],
                    deleted:true
                  })
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
  };

  handleInValidSubmit = (event, values) => {
    this.setState({
        error:"Invalid Form Values"
    });
  };

  render() {
    var redirect = null
    if(!this.state.connected){
      redirect = <Redirect to="/connecttodatabase"></Redirect>
    }
    if(this.state.deleted){
      redirect = <Redirect to="/viewDatabase"></Redirect>
    }
    var error = null
    if(this.state.error){
      error = <p className="text-danger text-center">{this.state.error}</p>
    }
    return (
      <React.Fragment>
        {redirect}
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Delete a Table</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Modify Database</li>
                  <li className="breadcrumb-item active">Delete a Table</li>
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
                            errorMessage = "Select the table again"
                          > 
                            <option selected>select</option>
                            {this.state.keys.map((key) => (
                              <option value={key}>{key}</option>
                            ))}
                          </AvField>
                            
                        </div>
                
                        

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
