import React, { Component } from "react";
import axios from 'axios'
import { Redirect } from 'react-router'

import "../../App.css";
import Navbar from '../Navbar/Navbar'
import {BASE_URL} from '../../config'

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: (this.props.location.state && this.props.location.state.project),
            download: false
        }
    }

    componentDidMount() {
        var headers = new Headers();
        // axios.defaults.withCredentials = true;

        axios.post(BASE_URL + "/zip?project=" + this.state.project)
            .then(response => {
                console.log("Got the response", response.data);
                if (response.status === 200) {
                    this.setState({
                        download: true
                    })
                }
            })
    }

    render() {
        let downloadButton = null;
        if (this.state.download) {
            downloadButton = <a href={BASE_URL + "/static/" + this.state.project + ".zip"} class="btn btn-primary mt-4 pr-4 pl-4">
                Download
                            </a>
        }
        return (
            <div>
                <div>
                    <div class="main-content">
                        <Navbar></Navbar>
                        <div class="main-content-inner">

                            <div class="row">
                                <div class="col-lg-12 mt-5">
                                    <div class="card">
                                        <div class="card-body">
                                            <center>{downloadButton}</center>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// export default Form.create()(Navbar);
export default Result;
