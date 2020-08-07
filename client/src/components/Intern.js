import React, { Component } from 'react';
import axios from 'axios';
import InternForm from './InternForm';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

const INTERN_GET_SINGLE_API = 'http://localhost:5000/api/interns/get/single';
const INTERNS_DELETE_API = 'http://localhost:5000/api/interns/delete';
const INTERNS_DELETE_FROM_TEAM_API = 'http://localhost:5000/api/teams/delete-intern';
const INTERNS_DELETE_FROM_TASK_API = 'http://localhost:5000/api/tasks/delete-intern';

class Intern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intern: [],
      isLoading: true,
      internId: props.location.state.id
    }
    this.getIntern = this.getIntern.bind(this);
    this.deleteInternFull = this.deleteInternFull.bind(this);
    this.deleteIntern = this.deleteIntern.bind(this);
    this.deleteInternFromTask = this.deleteInternFromTask.bind(this);
    this.deleteInternFromTeam = this.deleteInternFromTeam.bind(this);
  }

  getIntern() {
    axios.post(INTERN_GET_SINGLE_API, { id: this.state.internId })
      .then(res => {
        this.setState({ 
          intern: res.data,
          isLoading: true
         });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  deleteInternFromTask(internId) {
    for (let i = 0; i < this.state.intern.tasks.length; i++) {
      const id = {
        internId: internId,
        taskId: this.state.intern.tasks[i]
      }
      axios.post(INTERNS_DELETE_FROM_TASK_API, id);
    } 
  }

  deleteInternFromTeam(internId) {
    for (let i = 0; i < this.state.intern.teams.length; i++) {
      const id = {
        internId: internId,
        teamId: this.state.intern.teams[i]
      }
      axios.post(INTERNS_DELETE_FROM_TEAM_API, id);
    }
  }

  deleteIntern(internId) {
    axios.post(INTERNS_DELETE_API, { id: internId })
      .then(() => {
        this.props.updateMain();
        this.props.updateData();
      })
  }

  deleteInternFull(internId) {
    this.deleteInternFromTask(internId);
    this.deleteInternFromTeam(internId);
    this.deleteIntern(internId);
  }

  componentDidMount() {
    this.getIntern();
  }

  render() {
    let internData = this.state.intern;
    let intern = null;

    if (this.state.intern) {
      intern = (
      <div>
        <h3>{internData.name}</h3>
        <p>{internData.email}</p>
        <span>School: {internData.school} &nbsp; Major: {internData.major}</span>
        <p>Weekly Hours Worked: {internData.weeklyHours}</p>
        <p>Total Hours Worked: {internData.totalHours}</p>
        <button type="button" onClick={() => this.deleteInternFull(internData._id)}>Delete Intern</button>
      </div>)
    }

    return (
      <div>
        {intern}
      </div>
    )
  }
}

export default Intern;