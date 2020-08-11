import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import TeamForm from './TeamForm';

const TEAMS_GET_SINGLE_API = 'http://localhost:5000/api/teams/get/single';
const TEAMS_DELETE_API = 'http://localhost:5000/api/teams/delete';
const TEAMS_DELETE_FROM_TASK_API = 'http://localhost:5000/api/tasks/delete-team';
const TEAMS_DELETE_FROM_INTERN_API = 'http://localhost:5000/api/interns/delete-team';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [],
      teamId: props.location.state.id,
      showEditModal: false,
      isLoading: true
    }

    this.updateData = this.updateData.bind(this);
  }

  updateData() {
    this.setState({ isLoading: this.state.isLoading });
  }

  // get team data and set state
  getTeam() {
    this.setState({ isLoading: true });
    axios.post(TEAMS_GET_SINGLE_API, { id: this.state.teamId })
      .then(res => {
        this.setState({ 
          team: res.data,
         });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  // loop through team's tasks and remove team from task 
  deleteTeamFromTasks(teamId) {
    this.state.team.tasks.forEach(task => {
      const teamToDelete = {
        teamId: teamId,
        taskId: task.id
      }
      axios.post(TEAMS_DELETE_FROM_TASK_API, teamToDelete);
    });
  }

  // loop through team's interns and remove team from intern
  deleteTeamFromInterns(teamId) {
    this.state.team.members.forEach(intern => {
      const teamToDelete = {
        teamId: teamId,
        internId: intern.id
      }
      axios.post(TEAMS_DELETE_FROM_INTERN_API, teamToDelete);
    });
  }

  // delete team from collection
  deleteTeam(teamId) {
    axios.post(TEAMS_DELETE_API, { id: teamId });
  }

  // systematically delete team - from tasks, interns, then team collection
  deleteTeamFull(teamId) {
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
        <p>{teamData.members.map(x => x.name)}</p>
        <TeamForm
          type={"edit"}
          id={teamData._id}
          updateData={this.updateData}
          updateMain={this.props.updateMain}
        />
        <Link to="/"><button type="button" onClick={() => this.deleteTeamFull(teamData._id)}>Delete Team</button></Link>
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