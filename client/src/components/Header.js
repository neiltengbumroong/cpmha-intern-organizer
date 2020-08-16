import React from 'react';
import { Container, Row, Col, Image, Button, ButtonToolbar } from 'react-bootstrap';
import Logo from '../images/CPMHA-logo-final.png';
import { Link } from 'react-router-dom';
import '../css/Header.css';

const Header = () => (
  <Container className="header-bg" fluid>
    <Row className="pb-3 pt-3 m-auto justify-content-center" >
      <Col className="col-4">
        <Link to="/"><Image className="img-responsive" src={Logo}></Image></Link>
      </Col>
      <Col className="col-4 mt-auto mb-auto ml-5">
        <ButtonToolbar>
          <Link to="/"><Button variant="cpmha-dark-purple" className="mr-2">Home</Button></Link>
          <Link to="/calendar"><Button variant="cpmha-dark-purple" className="mr-2">Calendar</Button></Link>
          <Link to="/contactlist"><Button variant="cpmha-dark-purple" className="mr-2">Contact List</Button></Link>
          <a href="https://concussionspainmentalhealth.com/" target="_blank" rel="nooponer noreferrer"><Button variant="cpmha-dark-purple">CPMHA Site</Button></a>
        </ButtonToolbar>
      </Col>
    </Row>
  </Container>
  
)

export default Header;