import React, { Component } from "react";
import { Row, Col, Button, FormGroup, Card } from "reactstrap";
import axios from 'axios'
import Dropzone from "react-dropzone";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link, Redirect } from "react-router-dom";
// Custom Scrollbar
import "chartist/dist/scss/chartist.scss";
import {BASE_URL} from '../../config'

class ExcelForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hostname:false,
            port:false,
            username:false,
            password:false,
            database:false,
            connected:false,
            connectionname:false,
            error:false,
            selectedFiles: [],
            excelFile:null
        };
        this.handleAcceptedFiles = this.handleAcceptedFiles.bind(this);
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.handleInValidSubmit = this.handleInValidSubmit.bind(this);
    }


    handleValidSubmit = (event,values) => {
        console.log("Values are: ",values)
        this.setState({
            hostname:values.hostname,
            port:values.port,
            username:values.username,
            password:values.password,
            database:values.database,
            connectionname:values.connectionname
        })
        

        event.preventDefault();
        // axios.defaults.withCredentials = true;
        
        const data = {
            userid:localStorage.getItem("userid"),
            applicationid:localStorage.getItem("applicationid"),
            connectionname:values.connectionname,
            hostname:values.hostname,
            username:values.username,
            password:values.password,
            database:values.database
        }

        axios.post(BASE_URL + "/createDatabase",data)
            .then(response => {
                console.log("Got the response",response.data);
                if(response.status === 200){
                    const data2 = {
                        userid:localStorage.getItem("userid"),
                        applicationid:localStorage.getItem("applicationid"),
                        connectionname:values.connectionname,
                        hostname:values.hostname,
                        username:values.username,
                        password:values.password,
                        database:values.database
                    }
                    console.log("data is: ",data)
                    axios.post(BASE_URL + "/database",data)
                        .then(response1 => {
                            console.log("DATABASE SAVING API RESPONSE IS: ",response1.data)
                            if(response1.status === 200){
                                console.log('New changes...................................')
                                var bodyFormData = new FormData();
                                bodyFormData.append('file', this.state.excelFile); 
                                bodyFormData.append('hostname',values.hostname)
                                bodyFormData.append('username',values.username)
                                bodyFormData.append('password',values.password) 

                                axios.post(" http://localhost:5000/excel-upload/"+data.database,bodyFormData)
                                    .then(response =>{
                                        console.log("DATABASE SAVING API RESPONSE IS: ",response.data)
                                        if(response.status === 200){
                                            localStorage.setItem("connected",true)
                                            localStorage.setItem("hostname",this.state.hostname)
                                            localStorage.setItem("username",this.state.username)
                                            localStorage.setItem("password",this.state.password)
                                            localStorage.setItem("database",this.state.database)
                                            localStorage.setItem("connectionname",this.state.connectionname)
                                            this.setState({ connected: true })
                                        }
                                    })
                                    .catch(error => {
                                        if(error.response){
                                            //console.log("Register API error is: ", error.response.data)
                                            this.setState({
                                              error:error.response.data["error"]
                                            })
                                          }
                                    })                                
                            }
                        })
                        .catch(error => {
                            if(error.response1){
                                // console.log("Register API error is: ", error.response.data)
                                this.setState({
                                  error:error.response1.data["error"]
                                })
                              }
                        })
                }
            })
            .catch(error => {
                if(error.response){
                    //console.log("Register API error is: ", error.response.data)
                    this.setState({
                      error:error.response.data["error"]
                    })
                  }
            })




        //this.setState({ selectedFiles: files });
    };

    handleInValidSubmit = files => {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: this.formatBytes(file.size)
            })
        );

        this.setState({ selectedFiles: files });
    };

    handleAcceptedFiles = files => {
        var excelFile = this.state.excelFile
        files.map(file => {
            excelFile = file
            // console.log(file)
        });
        
        this.setState({
            selectedFiles : files
        })
        this.setState({ excelFile: excelFile });
      };

    render() {
        var redirect = null
        var error = null

        if(this.state.error){
            console.log("Error should be printed")
            error = <p>{this.state.error}</p>
        }

        if(this.state.redirect || localStorage.getItem("connected")=="true"){
            redirect = <Redirect to="/manageDatabase"></Redirect>
        }
        return (
            <React.Fragment>
                {redirect}
            {error}
                <AvForm onValidSubmit = {this.handleValidSubmit}>
                    <AvField
                        name="connectionname"
                        label="Connection Name"
                        placeholder="Eg. test"
                        type="text"
                        errorMessage="Enter valid connection name"
                        validate={{ required: { value: true } }}
                    />

                    <AvField
                        name="hostname"
                        label="Database Address"
                        placeholder="127.0.0.1"
                        type="text"
                        errorMessage="Enter Database Address"
                        validate={{ required: { value: true } }}
                    />
                    <AvField
                        name="databaseport"
                        label="Database Port"
                        placeholder="3000"
                        type="text"
                        errorMessage="Enter Database Port"
                        validate={{ required: { value: true } }}
                    />
                    <AvField
                        name="username"
                        label="Username"
                        placeholder="root"
                        type="text"
                        errorMessage="Enter Database Username"
                        validate={{ required: { value: true } }}
                    />
                    <AvField
                        name="password"
                        label="Password"
                        placeholder="Password"
                        type="password"
                        errorMessage="Enter Database Password"
                        validate={{ required: { value: true } }}
                    />
                    <AvField
                        name="database"
                        label="Database Name"
                        placeholder="Database Name"
                        type="text"
                        errorMessage="Enter Database Name"
                        validate={{ required: { value: true } }}
                    />
                    <Dropzone
                        onDrop={acceptedFiles =>
                            this.handleAcceptedFiles(acceptedFiles)
                        }    
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                                <div
                                    className="dz-message needsclick"
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <h3>Drop files here or click to upload.</h3>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                    <div
                        className="dropzone-previews mt-3"
                        id="file-previews"
                    >
                        {this.state.selectedFiles.map((f, i) => {
                            return (
                                <Card
                                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                    key={i + "-file"}
                                >
                                    <div className="p-2">
                                        <Row className="align-items-center">
                                            <Col className="col-auto">
                                                <img
                                                    data-dz-thumbnail=""
                                                    height="80"
                                                    className="avatar-sm rounded bg-light"
                                                    alt={f.name}
                                                    src={f.preview}
                                                />
                                            </Col>
                                            <Col>
                                                <Link
                                                    to="#"
                                                    className="text-muted font-weight-bold"
                                                >
                                                    {f.name}
                                                </Link>
                                                <p className="mb-0">
                                                    <strong>{f.formattedSize}</strong>
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                    <FormGroup className="mb-0">
                        <div>
                            <Button type="submit" color="primary" className="mr-2">
                                Create
                            </Button>
                            <Button type="reset" color="secondary">
                                Cancel
                            </Button>
                        </div>
                    </FormGroup>
                </AvForm>
            </React.Fragment>
        );
    }
}

export default ExcelForm;
