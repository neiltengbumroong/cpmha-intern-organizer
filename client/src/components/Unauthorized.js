import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Header from './Header';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <>
    <Header auth={false}/>
    <Container className="main-background" fluid>
      <Row className="pt-5 justify-content-center">
        <Col md={4} sm={8} className="text-center">
          <h3>Unauthorized!!!</h3>
          <p>This page is designed to let you know that you tried to access secret CPMHA
          stuff. In order to access the page, use your secret
          credentials key at the login page. If you believe there is an issue or you don't have one, contact 
          Alex Dwork at ad@cpmha.com.</p>
          <Link to="/"><Button variant="cpmha-dark-purple">Log In</Button></Link>
        </Col> 
      </Row>
    </Container>
  </>
);

export default Unauthorized;