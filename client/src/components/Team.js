import React, { Component } from 'react';
import axios from 'axios';

const TEAMS_GET_SINGLE_API = 'http://localhost:5000/api/teams/get/single';
const TEAMS_DELETE_API = 'http://localhost:5000/api/teams/delete';
const TEAMS_DELETE_FROM_TASK_API = 'http://localhost:5000/api/tasks/delete-team';
const TEAMS_DELETE_FROM_INTERN_API = 'http://localhost:5000/api/interns/delete-team';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [],
      isLoading: true
    }
  }

  getTeam() {
    axios.post(TEAMS_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({ 
          team: res.data,
          isLoading: true
         });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  deleteTeamFromTasks(teamId) {
    console.log(this.state.team);
    console.log(this.state.team.tasks);
    for (let i = 0; i < this.state.team.tasks.length; i++) {
      const id = {
        teamId: teamId,
        taskId: this.state.team.tasks[i]
      }
      axios.post(TEAMS_DELETE_FROM_TASK_API, id);
    } 
  }

  deleteTeamFromInterns(teamId) {
    for (let i = 0; i < this.state.team.members.length; i++) {
      const id = {
        teamId: teamId,
        internId: this.state.team.members[i]
      }
      axios.post(TEAMS_DELETE_FROM_INTERN_API, id);
    } 
  }

  deleteTeam(teamId) {
    axios.post(TEAMS_DELETE_API, { id: teamId })
      .then(() => {
        this.props.updateData();
      })
  }

  deleteTeamFull(teamId) {
    window.location.reload();
    this.deleteTeamFromTasks(teamId);
    this.deleteTeamFromInterns(teamId);
    this.deleteTeam(teamId);
  }

  componentDidMount() {
    this.getTeam();
  }

  render() {
    let teamData = this.state.team;
    let team = null;

    if (!this.state.isLoading) {
      team = (
      <div>
        <h3>{teamData.name}</h3>
        <p>{teamData.members}</p>
        {this.state.isLoading ? null : 
        <button type="button" onClick={() => this.deleteTeamFull(teamData._id)}>Delete Team</button>}
      </div>)
    }

    return (
      <div>
        {team}
      </div>
    )
  }
}

export default Team;