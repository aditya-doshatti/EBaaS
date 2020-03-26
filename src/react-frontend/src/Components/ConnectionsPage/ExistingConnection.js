import React, { Component } from "react";
import axios from 'axios'
import {Redirect} from 'react-router'

import "../../App.css";

class ExistingConnection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project:"",
            hostname:"",
            port:3306,
            username:"",
            password:"",
            database:"",
            redirect:false
        };
    }

    handleChange = (e) =>{
        console.log(e.target.value+ " "+ e.target.id);
        const id = e.target.id
        const value = e.target.value
        this.setState({
            [id]: value
        })
    }

    onConnect = (e) => {
        console.log("onConnect called")
        var headers = new Headers();
        e.preventDefault();
        // axios.defaults.withCredentials = true;
        
        const data = {
            project:this.state.project,
            hostname:this.state.hostname,
            username:this.state.username,
            password:this.state.password,
            database:this.state.database
        }

        axios.post("http://localhost:5000/launch",data)
            .then(response => {
                console.log("Got the response",response.data);
                if(response.status === 200){
                    this.setState({
                        redirect: true
                    })
                }
            })
    }

    render() {
        let redirectVar = null;
        if(this.state.redirect){
            console.log("should be redirected")
            redirectVar = <Redirect to={{
                pathname: '/result',
                state: {
                    project: this.state.project
                }
            }} />
        }
        return (
            <div>
                {redirectVar}
                <form>
                    <div class="form-group">
                        <label for="example-text-input" class="col-form-label">
                            Project Name
                        </label>
                        <input
                            class="form-control"
                            type="text"
                            placeholder="Eg. myFirstProject"
                            id="project"
                            onChange = {this.handleChange}
                        />
                    </div>
                    <div class="form-group">
                        <label for="example-text-input" class="col-form-label">
                            Database Address(Hostname)
                        </label>
                        <input
                            class="form-control"
                            type="text"
                            placeholder="Eg. 127.0.0.1 or localhost"
                            id="hostname"
                            onChange = {this.handleChange}
                        />
                    </div>
                    <div class="form-group">
                        <label for="example-text-input" class="col-form-label">
                            Database Port
                        </label>
                        <input
                            class="form-control"
                            type="text"
                            placeholder="3306"
                            id="port"
                            onChange = {this.handleChange}
                        />
                    </div>
                    <div class="form-group">
                        <label for="example-text-input" class="col-form-label">
                            Username
                        </label>
                        <input
                            class="form-control"
                            type="text"
                            placeholder="Eg. admin"
                            id="username"
                            onChange = {this.handleChange}
                        />
                    </div>
                    <div class="form-group">
                        <label for="inputPassword" class="">
                            Password
                        </label>
                        <input
                            type="password"
                            class="form-control"
                            placeholder="Password"
                            id="password"
                            onChange = {this.handleChange}
                        />
                    </div>
                    <div class="form-group">
                        <label for="example-text-input" class="col-form-label">
                            Database Name
                        </label>
                        <input
                            class="form-control"
                            type="text"
                            placeholder="Eg. test"
                            id="database"
                            onChange = {this.handleChange}
                        />
                    </div>
                    <button type="button" class="btn btn-light mt-4 pr-4 pl-4">
                        Cancel
                    </button>
                    <button class="btn btn-primary mt-4 pr-4 pl-4" onClick={this.onConnect}>
                        Connect
                    </button>
                </form>
            </div>
        );
    }
}

// export default Form.create()(Navbar);
export default ExistingConnection;
