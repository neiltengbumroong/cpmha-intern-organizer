import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TeamForm from './TeamForm';
import Team from './Team';
import { Link } from 'react-router-dom';

const TEAM_GET_API = 'http://localhost:5000/api/teams/get';

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      isLoading: true
    }

    this.loadTeams = this.loadTeams.bind(this);
  }

  loadTeams() {
    axios.get(TEAM_GET_API)
      .then(res => {
        this.setState({ 
          teams: res.data,
          isLoading: true
        });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  componentDidMount() {
    this.loadTeams();
  }


  render() {
    let teams = null;

    if (!this.state.isLoading) {
      teams = this.state.teams.map((team, i) => 
      <div key={i}>
        <Link to={{
          pathname: '/teams/' + team.name,
          state: { id: team._id }
        }}>
          {team.name}
        </Link>
      </div>
      )
    }
    return (
      <>
        <h1>Teams</h1>
        <TeamForm 
          type={"create"}
          updateData={this.loadTeams} 
          updateMain={this.props.updateMain}
        />
        {teams}
      </>
    )
  }
}

export default Teams;