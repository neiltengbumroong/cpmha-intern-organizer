import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Logo from '../images/CPMHA-logo-final.png';
import { Link } from 'react-router-dom';

const Header = () => (
  <Container>
    <Row className="pb-4 pt-4">
      <Col className="md-4">
        <Image src={Logo} fluid></Image>
      </Col>
      <Col className="m-auto">
        <Link to="/">Home</Link>{' '}
        <Link to="/calendar">Calendar</Link>
      </Col>
    </Row>
  </Container>
  
)

export default Header;