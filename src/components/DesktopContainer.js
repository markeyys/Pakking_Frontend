import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {Container, Menu, Dropdown} from 'semantic-ui-react'

import { logout } from '../store/actions/auth';

class DesktopContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  logout = () => this.props.logout(this.props.history);

  render() {
    const { children, user } = this.props

    return (
      <div>
        <Menu className="top">
          <Container>
            {user.isAuthenticated
              ?
              <Menu.Menu position='right'>
                  <Menu.Item as={Link} to='/map'>Home</Menu.Item>
                  <Menu.Item as={Link} to='/favourite'>Favourite Carpark</Menu.Item>
                  <Menu.Item as={Link} to='/graph'>Analytics</Menu.Item>
                  <Dropdown item text='My Account'>
                    <Dropdown.Menu>
                      <Dropdown.Header
                        icon='user'
                        content={user.profile.email}
                      />
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
                      <Dropdown.Item onClick={this.logout} >Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              </Menu.Menu>
              : <Menu.Menu position='right'>
                  <Menu.Item as={Link} to='/login'>Login</Menu.Item>
                  <Menu.Item as={Link} to='/sign-up'>Sign up</Menu.Item>
                </Menu.Menu>
            }
          </Container>
        </Menu>
        {children}
      </div>
    )
  }
}

DesktopContainer.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
  logout: PropTypes.func
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { logout })(withRouter(DesktopContainer));