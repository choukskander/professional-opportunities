import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim() !== '') {
      navigate(`/jobs?keyword=${keyword}`);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src="/logo.png" 
                height="60" 
                className="d-inline-block align-top"
                alt="Job Portal Logo"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/admin/joblist">
                <Nav.Link>
                  <i className="fas fa-briefcase"></i> Jobs
                </Nav.Link>
              </LinkContainer>
              {userInfo && userInfo.role === 'hr' && (
                <LinkContainer to="/admin/joblist">
                  <Nav.Link>Admin Panel</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
            {/* Add spacing with a 'me-3' class to the Nav */}
             {/* Search Form */}
             <Form onSubmit={submitHandler} className="d-flex me-3"> {/* Add spacing with 'me-3' */}
              <Form.Control
                type="text"
                placeholder="Search jobs..."
                className="mr-2" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button variant="outline-light" type="submit">
                Search
              </Button>
            </Form>
            <Nav> 
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus"></i> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
           
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;