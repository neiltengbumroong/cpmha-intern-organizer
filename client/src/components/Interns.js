import React, { Component } from 'react';
import axios from 'axios';
import InternForm from './InternForm';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const INTERN_GET_API = 'http://localhost:5000/api/interns/get';

class Interns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interns: [],
      isLoading: true
    }
  }

  loadInterns = () => {
    axios.get(INTERN_GET_API)
      .then(res => {
        this.setState({ 
          interns: res.data,
          isLoading: true
        });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  componentDidMount() {
    this.loadInterns();
  }

  render() {
    let interns = null;

    if (!this.state.isLoading) {
      interns = this.state.interns.map((intern, i) => 
      <div key={i}>
        <Link to={{
          pathname: '/interns/' + intern.name,
          state: { id: intern._id }
        }}>
          {intern.name}
        </Link>      
      </div>
      )
    }
    return (
      <div>
        <h1>Interns</h1>
        <InternForm 
          type={"create"} 
          updateData={this.loadInterns} 
          updateMain={this.props.updateMain}
        />
        {interns}
      </div>
    )
  }
}

export default Interns;