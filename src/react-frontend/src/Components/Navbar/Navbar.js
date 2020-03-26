import React, { Component } from "react";
import "../../App.css";


class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div class="header-area">

                    <div class="row align-items-center">
                        {/* <div class="col-md-6 col-sm-8 clearfix"> 
                            </div>*/}
                    </div>
                    <div class="page-title-area">
                        <div class="row align-items-center">
                            <div class="col-sm-6">
                                <div class="breadcrumbs-area clearfix">
                                    <h4 class="page-title pull-left">Enterprise Backend as a Service</h4>
                                    <ul class="breadcrumbs pull-left">
                                        <li><a href="/home">Home</a></li>
                                        <li><span>Connect to Database</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-sm-6 clearfix">
                                <div class="user-profile pull-right">
                                    <img class="avatar user-thumb" src="assets/images/author/avatar.png" alt="avatar" />
                                    <h4 class="user-name dropdown-toggle" data-toggle="dropdown">Devashish Nyati<i class="fa fa-angle-down"></i></h4>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" href="#">Settings</a>
                                        <a class="dropdown-item" href="#">Log Out</a>
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
export default Navbar;
