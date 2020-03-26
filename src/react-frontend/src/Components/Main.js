import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage'
import Navbar from './Navbar/Navbar'
import Result from './Result/Result'
class Main extends Component {

  render() {
    return (
      <div>
        <Route exact path="/" component={LandingPage}></Route>
        <Route exact path="/result" component={Result}></Route>
      </div>
    )
  }
}

export default Main;
