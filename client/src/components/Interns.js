import React, { Component } from 'react';
import axios from 'axios';
import InternForm from './InternForm';
import Intern from './Intern';

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
        <Intern id={intern._id} updateData={this.loadInterns}/>
        
      </div>
      )
    }
    return (
      <div>
        <h1>Interns</h1>
        <InternForm updateData={this.loadInterns}/>
        {interns}
      </div>
    )
  }
}

export default Interns;