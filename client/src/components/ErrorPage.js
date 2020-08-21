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
          <p>It appears that the page you're looking for doesn't exist.</p>
          <p>It's possible that the page has moved to a different name, or
             the entity you're trying to access has been deleted. If you don't think 
             this is the case or something is wrong, please email nt@cpmha.com ASAP. We're very sorry
             for the inconvenience!</p>
          <p> -CPMHA management</p>
          <Link to="/" ><Button variant="cpmha-dark-purple">Return to Homepage</Button></Link>
        </Col>
      </Row>
    </Container>
  </>

);

export default ErrorPage;