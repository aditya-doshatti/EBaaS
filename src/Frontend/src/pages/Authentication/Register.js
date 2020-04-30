import React, { Component } from "react";
import { Row, Col, Card, CardBody, Alert } from "reactstrap";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

import Loader from "../../components/Loader";
// action
import { registerUser, loginUser } from "../../store/actions";

// Redux
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

// import images
import logoSm from "../../assets/images/logo-sm.png";
import axios from 'axios'
import {BASE_URL} from '../../config'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: null
    };

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // handleValidSubmit
  handleValidSubmit(event, values) {
    if (values.password == values.confirm) {
      // event.preventDefaults()
      const data = {
        emailid: values.email,
        password: values.password,
        name:values.name
      }
      axios.post(BASE_URL + "/register", data)
        .then(response => {
          console.log("Register API response: ", response.data)
          if (response.status === 200) {
            if(!response.data["error"]){
              this.setState({
                redirect: true
              })
            }else{
              this.setState({
                error:response.data["error"]
              })
            }
          }
        })
        .catch(error => {
          if(error.response){
            console.log("Register API error is: ", error.response.data)
            this.setState({
              error:error.response.data["error"]
            })
          }
        })
    }else{
      this.setState({
        error: "Passwords doesn't match"
      })
    }

    // this.props.registerUser(values);
  }

  render() {
    var redirect = null
    var error = null
    if (this.state.redirect) {
      redirect = <Redirect to="/login"></Redirect>
    }

    if (this.state.error) {
      error = <p className="text-danger text-center">
        {this.state.error}
      </p>
    }
    return (
      <React.Fragment>
        {redirect}
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-dark">
            <i className="fas fa-home h2"></i>
          </Link>
        </div>
        <div className="account-pages my-5 pt-5">
          <div className="container">
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <div className="position-relative">
                  {this.props.loading ? <Loader /> : null}

                  <Card className="overflow-hidden">
                    <div className="bg-primary">
                      <div className="text-primary text-center p-4">
                        <h5 className="text-white font-size-20">
                          Sign up
                        </h5>
                        {/* <p className="text-white-50">
                          Get your free Veltrix account now.
                        </p> */}
                        <Link to="/" className="logo logo-admin">
                          <img src={logoSm} height="24" alt="logo" />
                        </Link>
                      </div>
                    </div>
                    <CardBody className="p-4">
                      <div className="p-3">
                        
                        <AvForm
                          className="form-horizontal mt-4"
                          onValidSubmit={this.handleValidSubmit}
                        >
                          {this.props.user && this.props.user ? (
                            <Alert color="success">
                              Register User Successfully
                            </Alert>
                          ) : null}
                          {this.props.registrationError &&
                            this.props.registrationError ? (
                              <Alert color="danger">
                                {this.props.registrationError}
                              </Alert>
                            ) : null}
                            {error}
                          <div className="form-group">
                            <AvField
                              name="name"
                              label="Name"
                              className="form-control"
                              placeholder="Enter Name"
                              type="text"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <AvField
                              name="email"
                              label="Email"
                              className="form-control"
                              placeholder="Enter email"
                              type="email"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <AvField
                              name="password"
                              label="Password"
                              type="password"
                              required
                              placeholder="Enter password"
                            />
                          </div>
                          <div className="form-group">
                            <AvField
                              name="confirm"
                              label="Confirm Password"
                              type="password"
                              required
                              placeholder="Confirm Password"
                            />
                          </div>
                          <Row className="form-group">
                            <div className="col-12 text-right">
                              <button
                                className="btn btn-primary w-md waves-effect waves-light"
                                type="submit"
                              >
                                Register
                              </button>
                            </div>
                          </Row>
                          {/* <Row className="form-group mt-2 mb-0">
                            <div className="col-12 mt-4">
                              <p className="mb-0">
                                By registering you agree to the Veltrix{" "}
                                <Link to="#" className="text-primary">
                                  Terms of Use
                                </Link>
                              </p>
                            </div>
                          </Row> */}
                        </AvForm>
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="mt-5 text-center">
                  <p>
                    Already have an account ?{" "}
                    <Link
                      to="login"
                      className="font-weight-medium text-primary"
                    >
                      {" "}
                      Login{" "}
                    </Link>{" "}
                  </p>
                  {/* <p>
                    © {new Date().getFullYear()} Veltrix. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger"></i> by Themesbrand
                  </p> */}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  const { user, registrationError, loading } = state.Account;
  return { user, registrationError, loading };
};

export default connect(mapStatetoProps, { registerUser, loginUser })(Register);
