import React from 'react';
import LoaderSVG from '../images/Loader.svg';
import { Row, Col } from 'react-bootstrap';

const Loader = () => (
  <Row className="mt-3">
    <Col xs={12} className="text-center">
      <img src={LoaderSVG} alt="loading svg"/>
    </Col>
  </Row>
)

export default Loader;