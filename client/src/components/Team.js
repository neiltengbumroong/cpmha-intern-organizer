import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from "react-router-dom";
import TeamForm from './TeamForm';
import moment from 'moment';
import { Jumbotron, Container, Row, Button, Col, Card } from 'react-bootstrap';

const TEAMS_GET_SINGLE_API = 'http://localhost:5000/api/teams/get/single';
const TEAMS_DELETE_API = 'http://localhost:5000/api/teams/delete';
const TEAMS_DELETE_FROM_TASK_API = 'http://localhost:5000/api/tasks/delete-team';
const TEAMS_DELETE_FROM_INTERN_API = 'http://localhost:5000/api/interns/delete-team';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [],
      teams: [],
      tasks: [],
      teamId: props.location.state.id,
      showModal: false
    }

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
    let teamComplete = [];
    let teamIncomplete = [];
    let teamMembers = [];

    // append teams into a comma separated list of links
    if (teamData.members) {
      teamMembers = teamData.members.map((intern, i) => (
        <span key={i}>
          { i > 0 && ", "}
          <Link to={{
            pathname: '/interns/' + intern.name,
            state: { id: intern.id }
          }}>{intern.name}</Link>
        </span>
      ))
    }


    return (
      <div>
        <Header/>
        {teamData.tasks ? 
        <>
          <Jumbotron>
            <Container className="text-center">
              <Row>
                <Col><h1>{teamData.name} Team</h1></Col>
              </Row>
              <Row className="pt-3 pb-3">
                <Col><h4>{teamData.description}</h4></Col>
              </Row>
              <Row className="pt-5 pb-3">
                <Col className="pl-5 ml-5">
                  <h1>{teamComplete.length}</h1>
                  <p>Tasks Completed</p>
                </Col>
                <Col>
                  <h1>{teamData.members.length}</h1>
                  <p>Members</p>
                </Col>
                <Col className="pr-5 mr-5">
                  <h1>{Math.round(moment.duration(moment(new Date()).diff(teamData.created)).asDays())}</h1>
                  <p>Days Old</p>
                </Col>
              </Row>
              <TeamForm
                type={"edit"}
                id={teamData._id}
              />
            </Container>
          </Jumbotron>
          <Container fluid>
            <Row>
              <Col className="col-4">
                <Card>
                  <Card.Body>
                    <Card.Title><h3>Team Details</h3></Card.Title>
                    <p><strong>Leader: </strong> 
                      <Link to={{
                        pathname: '/interns/' + teamData.leader.name,
                        state: { id: teamData.leader.id }
                      }}>{teamData.leader.name}</Link>
                    </p>
                    <p><strong>Members: </strong> {teamMembers}</p>
                    <p><strong>Created: </strong> {moment(teamData.joined).format('MMMM Do, YYYY')}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
          <Row className="m-5 justify-content-center">
             <Link to="/"><Button type="button" variant="danger"onClick={() => this.deleteTeamFull(teamData._id)}>Delete Team</Button></Link>
          </Row>
        </>
        : 
        <h1>Loading</h1>}
        
      </div>
    )
  }
}

export default Team;