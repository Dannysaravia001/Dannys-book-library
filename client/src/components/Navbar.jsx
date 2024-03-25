import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

const AppNavbar = () => {
  // State for controlling the display of the modal
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Navbar */}
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          {/* Navbar brand */}
          <Navbar.Brand as={Link} to='/'>
            Google Books Search
          </Navbar.Brand>
          {/* Navbar toggle button */}
          <Navbar.Toggle aria-controls='navbar' />
          {/* Navbar collapse content */}
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              {/* Nav links */}
              <Nav.Link as={Link} to='/'>
                Search For Books
              </Nav.Link>
              {/* Conditional rendering based on user authentication */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/saved'>
                    See Your Books
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Modal for Login/Sign Up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* Tab container for Login/Sign Up tabs */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              {/* Nav tabs for Login/Sign Up */}
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Tab content for Login/Sign Up */}
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                {/* Login form */}
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                {/* Sign Up form */}
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;