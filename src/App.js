import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './pages/PrivateRoute';
import { getProfile } from './store/actions/user';
import Analytics from './pages/Analytics';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    this.props.getProfile().finally(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    if (this.state && this.state.isLoading === false) {
      return (
        <div>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={Register} />
            <PrivateRoute path="/map" component={Home} />
            <PrivateRoute path="/about" component={About} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/graph" component={Analytics} />
          </Switch>
        </div>
      )
    } else {
      return (
        <div>Loading..</div>
      )
    }
  }
}

export default connect(null, { getProfile })(App);
