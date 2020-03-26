import React, { Component } from "react";
import "../../App.css";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/default-css.css";
import "../../assets/css/font-awesome.min.css";
import "../../assets/css/metisMenu.css";
// import "../../assets/css/owl.carousel.min.css";
import "../../assets/css/responsive.css";
import "../../assets/css/slicknav.min.css";
import "../../assets/css/styles.css";
import "../../assets/css/themify-icons.css";
import "../../assets/css/typography.css";



import ExistingConnection from "../ConnectionsPage/ExistingConnection";

class VerticalNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                    <div class="sidebar-menu">
                        <div class="sidebar-header">
                            <div class="logo">
                                <a href="index.html"><img src="assets/images/icon/logo.png" alt="logo" /></a>
                            </div>
                        </div>
                        <div class="main-menu">
                            <div class="menu-inner">
                                <nav>
                                    <ul class="metismenu" id="menu">
                                        <li>
                                            <a href="index.html" ><i class="ti-home"></i><span>Home</span></a>
                                        </li>
                                        <li>
                                            <a href="viewdatabase.html"><i class="fa fa-database"></i><span>View Database</span></a>
                                        </li>
                                        <li class="active">
                                            <a href="connecttodatabase.html"><i class="fa fa-connectdevelop"></i><span>Connect to Database</span></a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0)" aria-expanded="true"><i class="fa fa-server"></i><span>Modify Database</span></a>
                                            <ul class="collapse">
                                                <li><a href="addtable.html">Add new table</a></li>
                                                <li><a href="addcolumn.html">add new column</a></li>
                                                <li><a href="modifycolumn.html">modify a column</a></li>
                                                <li><a href="createrelation.html">create relationships</a></li>
                                                <li><a href="deletecolumn.html">delete column</a></li>
                                                <li><a href="deletetable.html">delete table</a></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="viewlogs.html"><i class="fa fa-file-text"></i><span>View Logs</span></a>
                                        </li>
                                        <li>
                                            <a href="securitysettings.html"><i class="ti-settings"></i><span>Security Settings</span></a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

// export default Form.create()(Navbar);
export default VerticalNavbar;
