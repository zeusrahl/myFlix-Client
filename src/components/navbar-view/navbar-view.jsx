import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export class NavBar extends React.Component {
  constructor () {
    super();

    this.state = {};
  }

  onLoggedOut() {
    localStorage.clear();
    window.open('/', '_self');
  }

  

  render() {
    const { user } = this.props;
    const movies = `/`;
    const profile = `/users/${user}`;

    if (!user) return null;

    return (
      <Navbar bg="dark" collapseOnSelect fixed="top" expand="lg" variant="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">

            <NavLink to={movies} className="link-text">
              Movies
            </NavLink>

            <NavLink  to={profile} className="link-text">
              Profile 
            </NavLink>

            <NavLink to='/' onClick={this.onLoggedOut}>
              Log Out 
            </NavLink>

          </Nav>
          <Form>
            <FormControl type='text' placeholder="Search" />
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar