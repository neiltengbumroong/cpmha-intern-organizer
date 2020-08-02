import React, { Component } from 'react';
import axios from 'axios';

const INTERN_URL = 'http://localhost:5000/interns';

class InternForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      school: '',
      major: '',
      email: '',
      dateJoined: new Date()
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleDateJoinedChange = this.handleDateJoinedChange.bind(this);
    this.createIntern = this.createIntern.bind(this);

  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }
  handleSchoolChange(event) {
    this.setState({ school: event.target.value });
  }
  handleMajorChange(event) {
    this.setState({ major: event.target.value });
  }
  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }
  handleDateJoinedChange(event) {
    this.setState({ dateJoined: event.target.value });
  }

  createIntern(event) {
    event.preventDefault();
    const internToCreate = {
      name: this.state.name,
      school: this.state.school,
      major: this.state.major,
      email: this.state.email,
      joined: this.state.dateJoined,
    }

    axios.post(INTERN_URL, internToCreate)
      .catch(error => {
        this.setState({ error: true })
      })

    this.props.close();
    
  }

  render() {
    return (
      <form>
        <h1>New Intern</h1>
        <label htmlFor="name">
          Name: &nbsp;
          <input id="name" type="text" onChange={this.handleNameChange}/><br/>
        </label>            
        <label htmlFor="email">
          Email: &nbsp;
          <input id="email" type="email" onChange={this.handleEmailChange}/><br/>
        </label>
        <label htmlFor="school">
          School: &nbsp;
          <input id="school" type="text" onChange={this.handleSchoolChange}/><br/>
        </label>          
        <label htmlFor="major">
          Major: &nbsp;
          <input id="major" type="text" onChange={this.handleMajorChange}/><br/>
        </label>       
        <label htmlFor="date-joined">
          Date Joined: &nbsp;
          {/* get all interns and perform mapping with select and options */}
          <input id="date-joined" type="date" onChange={this.handelDateJoinedChange}/><br/>
        </label>
        
        <button onClick={this.createIntern}>Add Intern</button>
        <button onClick={this.props.close}>Close</button>
      </form>
    )
  }
}

export default InternForm;