import React, { Component } from "react";
import "../../App.css";



import ExistingConnection from "../ConnectionsPage/ExistingConnection";
import VerticalNavbar from "../Navbar/VerticalNavbar";
import Navbar from "../Navbar/Navbar";

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div class="main-content">
                    <Navbar></Navbar>
                        <div class="main-content-inner">

                            <div class="row">
                                <div class="col-lg-12 mt-5">
                                    <div class="card">
                                        <div class="card-body">
                                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                <li class="nav-item">
                                                    <a class="nav-link active" id="pills-connect-tab" data-toggle="pill" href="#pills-connect" role="tab" aria-controls="pills-connect" aria-selected="false">Connect to Existing Database</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link" id="pills-create-tab" data-toggle="pill" href="#pills-create" role="tab" aria-controls="pills-create" aria-selected="true">Create a New Database - Coming Soon</a>
                                                </li> 
                                                {/* <li class="nav-item">
                                                    <a class="nav-link" id="pills-excel-tab" data-toggle="pill" href="#pills-excel" role="tab" aria-controls="pills-excel" aria-selected="false">Upload Excel</a>
                                                    </li> */}
                                                {/* <li class="nav-item">
                                                    <a class="nav-link" id="pills-sql-tab" data-toggle="pill" href="#pills-sql" role="tab" aria-controls="pills-sql" aria-selected="false">Upload SQL</a>
                                                </li> */}
                                            </ul>
                                            <div class="tab-content" id="pills-tabContent">
                                                <div class="tab-pane fade show active" id="pills-connect" role="tabpanel" aria-labelledby="pills-connect-tab">
                                                    <ExistingConnection></ExistingConnection>
                                                </div>
                                                <div class="tab-pane fade" id="pills-create" role="tabpanel" aria-labelledby="pills-create-tab">
                                                    <center><h3>Coming Soon</h3></center>
                                                </div>
                                                {/* <div class="tab-pane fade" id="pills-excel" role="tabpanel" aria-labelledby="pills-excel-tab">
                                                    <ExistingConnection></ExistingConnection>
                                                </div>
                                                <div class="tab-pane fade" id="pills-sql" role="tabpanel" aria-labelledby="pills-sql-tab">
                                                    <ExistingConnection></ExistingConnection>
                                                </div> */}
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
export default LandingPage;
