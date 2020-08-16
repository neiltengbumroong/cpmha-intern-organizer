import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import { Col, Row, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const INTERN_GET_API = 'http://localhost:5000/api/interns/get';

const BOARD_MEMBER_DATA = [
  { name: 'Paolo Dell Aquila', phone: '(561)-827-4111', email: 'pd@cpmha.com' },
  { name: 'Alexander Dwork', phone: '(561)-876-1668', email: 'ad@cpmha.com' },
  { name: 'Annushka Zaman', phone: '', email: 'az@cpmha.com' }
]

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interns: []
    }
  }

  loadInterns = () => {
    axios.get(INTERN_GET_API)
      .then(res => {
        this.setState({ interns: res.data });
      })
  }

  componentDidMount() {
    this.loadInterns();
  }

  render() {
    return (
      <div className="main-background">
        <Header/>
        <Container>
          <Row className="justify-content-center pt-4 pb-4">
            <h1>Contact List</h1>   
          </Row>
          <Row className="mb-3 border-bottom">
            <h2>Board Members</h2>
          </Row>
          <Row>        
            {BOARD_MEMBER_DATA.map((member, i) => (
              <Col xs={3} key={i} className="mb-3">
                <p><strong>{member.name}</strong></p>
                <p>{member.email}</p>
                <p>{member.phone}</p>
              </Col>
            ))}

          </Row>
          
          <Row className="mb-3 border-bottom">
            <h2>Interns</h2>
          </Row>
          <Row>
            {this.state.interns ? 
              this.state.interns.map((intern, i) => (
                <Col xs={3} key={i} className="mb-3">
                  <p><strong>{intern.name}</strong></p>
                  <p>{intern.email}</p>
                  <p>{intern.phone}</p>
                </Col>
              ))
              : <h1>Loading</h1>
            }

          </Row>
        </Container>
      </div>
      
     )
  }
  
}

export default ContactList;