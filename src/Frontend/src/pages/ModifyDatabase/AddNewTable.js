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
import {BASE_URL} from '../../config'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        tables: [{ name: "" }],
        connected:true,
        added:false,
        error:null
    };
  }

  componentDidMount(){
    if(!localStorage.getItem("connected")){
      Swal.fire({
        title: 'Not connected to the database',
        text: 'You will not be able to add tables without connection',
        icon: 'warning',
        confirmButtonText: "Ok, let's connect",
      }).then((result) => {
          this.setState({
            connected:false
          }) 
        })
    }
  }


  handleTableNameChange = idx => evt => {
    const newTables = this.state.tables.map((table, sidx) => {
      if (idx !== sidx) return table;
      return { ...table, name: evt.target.value };
    });

    this.setState({ 
      tables: newTables 
    },() => {
      console.log("State in Name Change: ",this.state.tables)
    });

  };

  handleAddRowNested = () => {
    this.setState({
      tables: this.state.tables.concat([{ name: "" }])
    },()=>{
      console.log("After adding a new row",this.state.tables)
    });
  };


  handleRemoveRowNested = idx => () => {
    this.setState({
      tables: this.state.tables.filter((s, sidx) => idx !== sidx)
    },() => {
      console.log("After removing a row",this.state.tables)
    });
  };


  handleValidSubmit = (event,values) => {
    console.log("Valid Submit")
    if(this.state.tables.length===0){
      Swal.fire({
        title: 'No Tables added',
        confirmButtonText: "I'll add some"
      })
    }else{
      event.preventDefault();
      const data = {
        hostname:localStorage.getItem("hostname"),
        username:localStorage.getItem("username"),
        password:localStorage.getItem("password"),
        database:localStorage.getItem("database"),
        tables : this.state.tables
    }
    
    axios.post(BASE_URL + "/createTable",data)
        .then(response => {
            console.log("Got the response",response.data);
            if(response.status === 200){
                Swal.fire({
                  title:"Tables added successfully"
                }).then((result)=>{
                  this.setState({
                    name: "",
                    tables: [{ name: "" }],
                    added:true
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
    if(this.state.added){
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
                <h4 className="font-size-18">Add New Table</h4>
                <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                    <Link to="/#">Home</Link>
                </li>
                <li className="breadcrumb-item active">Modify Database</li>
                <li className="breadcrumb-item active">Add New Table</li>
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
                            placeholder={localStorage.getItem("database") && localStorage.getItem("database")}
                          />
                        </div>

                        <div className="inner-repeater mb-4">
                          <table style={{ width: "100%" }}>
                            <Label>Table Name:</Label>
                            <tbody>
                              {this.state.tables.map((table, idx) => (
                                <tr id={"nested" + idx} key={idx}>
                                  <td>
                                    <Row className="mb-2">
                                      <Col md="10">
                                        <AvField
                                          name={
                                            "Enter Table " +
                                            (idx + 1)
                                          }
                                          className="inner form-control"
                                          type="text"
                                          placeholder={
                                            "Enter Table " +
                                            (idx + 1)
                                          }
                                          errorMessage="Enter Database Address"
                                          value={table.name}
                                          onChange={this.handleTableNameChange(idx)}
                                          validate={{ required: { value: true } }}
                                        />
                                        {/* <Input
                                          type="text"
                                          className="inner form-control"
                                          placeholder={
                                            "Enter Table " +
                                            (idx + 1)
                                          }
                                          value={table.name}
                                          onChange={this.handleTableNameChange(idx)}
                                          required
                                        /> */}
                                      </Col>
                                      <Col md="2">
                                        <Button
                                          onClick={
                                            this.handleRemoveRowNested(idx)
                                          }
                                          color="danger"
                                          outline
                                          className="waves-effect waves-light"
                                          style={{ width: "100%" }}
                                        >
                                          Delete
                                        </Button>
                                      </Col>
                                    </Row>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <Button
                            onClick={this.handleAddRowNested}
                            color="success"
                            className="mt-1"
                          >
                            Add Another Table
                          </Button>
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
