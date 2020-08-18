import React from 'react';
import { Container, Row, Col, Image, Button, ButtonToolbar } from 'react-bootstrap';
import Logo from '../images/CPMHA-logo-final.png';
import { Link } from 'react-router-dom';

const Header = () => (
  <Container className="header-bg" fluid>
    <Row className="pb-3 pt-3 m-auto justify-content-center" >
      <Col md={5} sm={12} className="offset-1">
        <Link to="/"><Image className="img-responsive" src={Logo}></Image></Link>
      </Col>
      <Col md={5} sm={12} className="mt-auto mb-auto mr-5 text-center">
        <ButtonToolbar>
          <Link to="/"><Button variant="cpmha-dark-purple" className="mr-2 mb-2">Home</Button></Link>
          <Link to="/calendar"><Button variant="cpmha-dark-purple" className="mr-2 mb-2">Calendar</Button></Link>
          <Link to="/contactlist"><Button variant="cpmha-dark-purple" className="mr-2 mb-2">Contact List</Button></Link>
          <a href="https://concussionspainmentalhealth.com/" target="_blank" rel="noopener noreferrer"><Button variant="cpmha-dark-purple">CPMHA Site</Button></a>
        </ButtonToolbar>
      </Col>
    </Row>
  </Container>
  
)

export default Header;