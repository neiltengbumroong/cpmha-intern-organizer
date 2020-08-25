import React, { Component } from 'react';
import {  Row, Col, Form, Button, Container } from 'react-bootstrap';
import Header from './Header';

import { LOGIN_KEY } from '../utils/key';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      isValidated: false,
      isInvalid: false,
      isChecked: false
    }
  }

  handleKeyChange = event => {
    this.setState({ key: event.target.value }, () => {
      if (this.state.key === LOGIN_KEY) {
        this.setState({ isValidated: true });
      }
    });
  }

  handleCheckChange = () => {
    this.setState({ isChecked: !this.state.isChecked });
  }

  handleSubmit = () => {
    // if valid, set variable in local storagein local storage, 
    // update state in App.js, and redirect to Main
    if (this.state.isValidated) {
      localStorage.setItem('remember', this.state.isChecked);
      this.props.validateLogin();
      this.props.history.push('/main');
    } else {
      this.setState({ isInvalid: true });
    }  
  }

  render() {
    return (
      <>
        <Header auth={false}/>
        <Container className="main-background h-100 pt-5" fluid>
          <Row className="justify-content-center my-auto">
            <Col xs={8} sm={6} className="">
              <h3 className="text-center">Welcome to CPMHA Manager!</h3>
            </Col>     
          </Row>
          <Row className="justify-content-center mt-3">
            <Col xs={8} sm={6} className="my-auto">
              <p className="text-center">Access the site by typing your credential key below.</p>
            </Col>    
          </Row>
          <Form>
            <Form.Group as={Row} className="justify-content-center">
              <Col xs={6} sm={3}>
                <Form.Control
                  placeholder="Key"
                  onChange={this.handleKeyChange}
                  isInvalid={this.state.isInvalid}
                  type="password"
                />{' '}
                <Form.Control.Feedback type="invalid">
                  Sorry, this key is incorrect.
                </Form.Control.Feedback>
              </Col>          
            </Form.Group>
            <Form.Group as={Row} className="justify-content-center">
              <Col xs={6} sm={3} className="text-center">
                <Form.Check
                  type={'checkbox'}
                  label={'Keep me logged in'}
                  onChange={this.handleCheckChange}
                />
              </Col>             
            </Form.Group>
            <Form.Group as={Row} className="justify-content-center">
              <Button variant="cpmha-dark-purple" onClick={this.handleSubmit}>Log In</Button>
            </Form.Group>    
          </Form>        
        </Container>
      </>
    )
  }
}

export default Login;