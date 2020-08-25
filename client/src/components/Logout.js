import React from 'react';
import { Row, Button, Container, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './Header';

const Logout = () => (
  <>
    <Header auth={false}/>
    <Container className="main-background" fluid>
      <Row className="pt-5 justify-content-center">
        <Col sm={4} xs={9} className="text-center">
          <h3>Success!</h3>
          <p>You are now logged out. You can still access the pages until
            you close the window or leave the site. If you are using a public computer,
            now would be a good time to do so.
          </p>
        </Col>     
      </Row>
      <Row className="pt-3 justify-content-center">
        <Link to="/"><Button variant="cpmha-dark-purple">Login Page</Button></Link>
      </Row>
    </Container>
  </>
)

export default Logout;