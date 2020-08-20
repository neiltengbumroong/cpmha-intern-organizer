import React from 'react';
import Header from './Header';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ErrorPage = () => (
  <>
    <Header/>
    <Container className="main-background" fluid>
      <Row className="justify-content-center pt-5">
        <Col className="text-center" xs={4}>
          <h1>Whoops!</h1>
          <p>It appears that the page you're looking for doesn't exist anymore.</p>
          <p>It's possible that the page has moved to a different name, or
             the entity you're trying to access has been deleted. We're very sorry
             for the inconvenience!</p>
          <Link to="/" ><Button variant="cpmha-dark-purple">Return to Homepage</Button></Link>
        </Col>
      </Row>
    </Container>
  </>

);

export default ErrorPage;