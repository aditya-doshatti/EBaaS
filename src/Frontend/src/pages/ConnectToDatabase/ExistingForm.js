import React, { Component } from "react";
import { Button, FormGroup} from "reactstrap";
import axios from 'axios'
import { AvForm, AvField } from "availity-reactstrap-validation";

// Custom Scrollbar



// import images
import "chartist/dist/scss/chartist.scss";
import { Redirect } from "react-router-dom";

class ExistingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hostname:false,
            port:false,
            username:false,
            password:false,
            database:false,
            download:false,
            connectionname:false,
            error:false
        };

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.handleInValidSubmit = this.handleInValidSubmit.bind(this);
    }

    handleValidSubmit = (event,values) => {
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
            connectionname:this.state.connectionname,
            hostname:this.state.hostname,
            username:this.state.username,
            password:this.state.password,
            database:this.state.database
        }

        axios.post("http://localhost:5000/connectToDatabase",data)
            .then(response => {
                console.log("CONNECT TO DATABASE API RESPONSE IS: ",response.data)
                if(response.status === 200){
                    axios.post("http://localhost:5000/database",data)
                        .then(response2 => {
                            console.log("ADD DATABASE API RESPONSE IS: ",response2.data)
                            if(response.status === 200){
                                localStorage.setItem("hostname",this.state.hostname)
                                localStorage.setItem("username",this.state.username)
                                localStorage.setItem("password",this.state.password)
                                localStorage.setItem("database",this.state.database)
                                localStorage.setItem("connectionname",this.state.connectionname)
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
    };

    handleInValidSubmit = (event, values) => {
        this.setState({
            error:"Invalid Form Values"
        });
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
                <AvForm onValidSubmit={this.handleValidSubmit} onInvalidSubmit={this.handleInValidSubmit}>
                    <AvField
                        name="connectionname"
                        label="Connection Name"
                        placeholder="Eg. test connection"
                        type="text"
                        errorMessage="Enter Connection Name"
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
                        name="port"
                        label="Database Port"
                        placeholder="3306"
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
                    <FormGroup className="mb-0">
                        <div>
                            <Button type="submit" color="primary" className="mr-2">
                                Connect
                            </Button>
                            <Button type="reset" color="secondary" className="mr-2">
                                Cancel
                            </Button>
                        </div>
                    </FormGroup>
                </AvForm>
                {error}
                
            </React.Fragment>
        );
    }
}

export default ExistingForm;
