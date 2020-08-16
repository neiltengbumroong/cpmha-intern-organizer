import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from "react-router-dom";
import TeamForm from './TeamForm';
import Task from './Task';
import moment from 'moment';
import { Jumbotron, Container, Row, Button, Col, Card } from 'react-bootstrap';

const TEAMS_GET_SINGLE_API = 'http://localhost:5000/api/teams/get/single';
const TASK_GET_SINGLE_API = 'http://localhost:5000/api/tasks/get/single';
const TEAMS_DELETE_API = 'http://localhost:5000/api/teams/delete';
const TEAMS_DELETE_FROM_TASK_API = 'http://localhost:5000/api/tasks/delete-team';
const TEAMS_DELETE_FROM_INTERN_API = 'http://localhost:5000/api/interns/delete-team';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';

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
  getTeam = () => {
    axios.post(TEAMS_GET_SINGLE_API, { id: this.state.teamId })
      .then(res => {
        this.setState({ team: res.data });
        this.getAllTeams();
        this.getTeamTasks();
      })
  }

  // get all teams' data to display
  getAllTeams = () => {
    axios.get(TEAM_GET_API)
      .then(res => {
        this.setState({ teams: res.data })
      })
  }

  getTeamTasks = () => {
    this.state.team.tasks.forEach(task => {
      axios.post(TASK_GET_SINGLE_API, { id: task.id })
      .then(res => {
          this.setState({ tasks: [...this.state.tasks, res.data]});
        })
    })
  }

  // loop through team's tasks and remove team from task 
  deleteTeamFromTasks = teamId => {
    this.state.team.tasks.forEach(task => {
      const teamToDelete = {
        teamId: teamId,
        taskId: task.id
      }
      axios.post(TEAMS_DELETE_FROM_TASK_API, teamToDelete);
    });
  }

  // loop through team's interns and remove team from intern
  deleteTeamFromInterns = teamId => {
    this.state.team.members.forEach(intern => {
      const teamToDelete = {
        teamId: teamId,
        internId: intern.id
      }
      axios.post(TEAMS_DELETE_FROM_INTERN_API, teamToDelete);
    });
  }

  // delete team from collection
  deleteTeam = teamId => {
    axios.post(TEAMS_DELETE_API, { id: teamId });
  }

  // systematically delete team - from tasks, interns, then team collection
  deleteTeamFull = teamId => {
    this.deleteTeamFromTasks(teamId);
    this.deleteTeamFromInterns(teamId);
    this.deleteTeam(teamId);
    
  }

  componentDidMount() {
    this.getTeam();
  }

  componentDidUpdate() {
    // check if the props for the team's id are different
    if (this.state.teamId != this.props.location.state.id) {
      // set new ID and clear out team and tasks
      this.setState({ 
        teamId: this.props.location.state.id,
        team: [],
        tasks: []
      }, () => {
        // once state is set, scroll to the top of the team page as well
        this.getTeam();
        // window.location.reload();
        window.scrollTo(0, 0);
      });    
    }
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

    // separate tasks into groups based on completion status
    if (this.state.tasks) {
      this.state.tasks.forEach(task => {
        if (task.completed) {
          teamComplete.push(task);
        } else {
          teamIncomplete.push(task);
        }
      })
    }

    return (
      <div className="main-background">
        <Header/>
        {teamData.tasks ? 
        <>
          <Jumbotron>
            <Container className="text-center">
              <Row>
                <Col>
                  <h1>{teamData.name} Team</h1>
                  <p>{teamData.description}</p>
                </Col>
              </Row>
              <Row className="pt-3 pb-3">
                <Col className="pl-5 ml-5">
                  <h1>{teamData.members.length}</h1>
                  <p>Members</p>  
                </Col>
                <Col>
                  <h1>{teamComplete.length}</h1>
                  <p>Tasks Completed</p>
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
                    {teamData.leader ?
                      <Link to={{
                        pathname: '/interns/' + teamData.leader.name,
                        state: { id: teamData.leader.id }
                      }}>{teamData.leader.name}</Link>
                      :
                      null}
                    </p>
                    <p><strong>Members: </strong> {teamMembers}</p>
                    <p><strong>Created: </strong> {moment(teamData.joined).format('MMMM Do, YYYY')}</p>
                  </Card.Body>
                </Card>
                <Card className="mt-5">
                  <Card.Body>
                    <Card.Title><h3>Other Teams</h3></Card.Title>
                      {this.state.teams.map((team, i) => (
                        team._id === this.state.teamId ? '' : 
                        <div key={i}>
                          <Link to={{
                            pathname: '/teams/' + team.name,
                            state: { id: team._id }
                          }}>
                            {team.name}
                          </Link>
                        </div>
                        ))
                      } 
                  </Card.Body>
                </Card>
              </Col>
              <Col className="col-4 text-left scroll-column">
                <h2>Pending Tasks</h2>
                {teamIncomplete.length > 0 ? teamIncomplete.map((task, i) => (
                <div className="mt-3 mb-3" key={i}>
                  <Task id={task._id} view={'other'}></Task>
                  <hr/>
                </div>
                ))
                : <p>This team currently has no pending tasks.</p>}
              </Col>
              <Col className="col-4 text-left scroll-column">
                <h2>Completed Tasks</h2>
                {teamComplete.length > 0 ? teamComplete.map((task, i) => (
                <div className="mb-5" key={i}>
                  <Task id={task._id} view={'other'}></Task>
                </div>
                ))
                : <p>This team has no completed tasks.</p>}
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