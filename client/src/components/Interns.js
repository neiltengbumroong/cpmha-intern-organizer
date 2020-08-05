import React, { Component } from 'react';
import axios from 'axios';
import InternForm from './InternForm';

const INTERN_GET_API = 'http://localhost:5000/api/interns/get';

class Interns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interns: [],
      isLoading: true
    }
    this.loadInterns = this.loadInterns.bind(this);
  }

  loadInterns() {
    axios.get(INTERN_GET_API)
      .then(res => {
        this.setState({ interns: res.data });
        this.setState({ isLoading: true });
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
        <h3>{intern.name}</h3>
        <p>{intern.email}</p>
        <span>School: {intern.school} &nbsp; Major: {intern.major}</span>
        <p>Weekly Hours Worked: {intern.weeklyHours}</p>
        <p>Total Hours Worked: {intern.totalHours}</p>
      </div>
      )
    }
    return (
      <div>
      <InternForm/>
      {interns}
      </div>
    )
  }
}

export default Interns;