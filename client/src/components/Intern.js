import React, { Component } from 'react';
import axios from 'axios';
import InternForm from './InternForm';
import Header from './Header';
import Task from './Task';
import { Link } from "react-router-dom";
import { getAllInterns } from '../utils/index.js';
import moment from 'moment';
import { Jumbotron, Container, Row, Button, Col, Card } from 'react-bootstrap';
import '../css/Intern.css';

const INTERN_GET_SINGLE_API = 'http://localhost:5000/api/interns/get/single';
const TASK_GET_SINGLE_API = 'http://localhost:5000/api/tasks/get/single';
const INTERNS_DELETE_API = 'http://localhost:5000/api/interns/delete';
const INTERNS_DELETE_FROM_TEAM_API = 'http://localhost:5000/api/teams/delete-intern';
const INTERNS_DELETE_FROM_TASK_API = 'http://localhost:5000/api/tasks/delete-intern';

class Intern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intern: [],
      interns: [],
      tasks: [],
      isLoading: true,
      internId: props.location.state.id,
      showEditModal: false
    }
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  // get intern data and set the state
  getIntern = async () => {
    axios.post(INTERN_GET_SINGLE_API, { id: this.state.internId })
      .then(res => {
        this.setState({ intern: res.data });
        this.getInternTasks();
      })
    getAllInterns()
      .then(res => {
        this.setState({ interns: res });
      })

  }

  getInternTasks = () => {
    this.state.intern.tasks.forEach(task => {
      axios.post(TASK_GET_SINGLE_API, { id: task.id })
        .then(res => {
          this.setState({ tasks: [...this.state.tasks, res.data]});
        })
    })
  }

  // remove intern from tasks' assignedTo attribute upon deletion
  deleteInternFromTask = internId => {
    this.state.intern.tasks.forEach(task => {
      const internToDelete = {
        internId: internId,
        taskId: task.id
      };
      axios.post(INTERNS_DELETE_FROM_TASK_API, internToDelete);
    })
  }

  // remove intern from teams' tasks attribute upon deletion
  deleteInternFromTeam = internId => {
    this.state.intern.teams.forEach(team => {
      const internToDelete = {
        internId: internId,
        teamId: team.id
      }
      axios.post(INTERNS_DELETE_FROM_TEAM_API, internToDelete);
    })
  }

  // delete intern document from collection 
  deleteIntern = internId => {
    axios.post(INTERNS_DELETE_API, { id: internId })
  }

  // when called, delete systematically from task, team, and then intern collections
  deleteInternFull = internId => {
    this.deleteInternFromTask(internId);
    this.deleteInternFromTeam(internId);
    this.deleteIntern(internId);
  }

  componentDidMount() {
    this.getIntern();
  }

  componentDidUpdate() {
    // check if the props for the intern's id are different
    if (this.state.internId != this.props.location.state.id) {
      // set new ID and clear out interns and tasks
      this.setState({ 
        internId: this.props.location.state.id,
        intern: [],
        tasks: []
      }, () => {
        // once state is set, scroll to the top of the intern page as well
        this.getIntern();
        // window.location.reload();
        window.scrollTo(0, 0);
      });    
    }
  }


  render() {
    const internData = this.state.intern;
    let internTeams = null;
    let internComplete = [];
    let internIncomplete = [];

    // append teams into a comma separated list of links
    if (internData.teams) {
      internTeams = internData.teams.map((team, i) => (
        <span key={i}>
          { i > 0 && ", "}
          <Link to={{
            pathname: '/teams/' + team.name,
            state: { id: team.id }
          }}>{team.name}</Link>
        </span>
      ))
    }

    // separate tasks into groups based on completion status
    if (this.state.tasks) {
      this.state.tasks.forEach(task => {
        if (task.completed) {
          internComplete.push(task);
        } else {
          internIncomplete.push(task);
        }
      })
    }
    
    return (
      <div>
        <Header/>
        {internData.tasks ? 
        <>
        <Jumbotron className="intern-jumbo-wrapper">
          <Container className="text-center">
            <Row>
              <Col><h1>{internData.name}</h1></Col>   
            </Row>
            <Row className="pb-3">
              <Col><h5>{internData.email}</h5></Col>
            </Row>
            <Row className="pt-3 pb-5">
              <Col>
                <h1>{internData.weeklyHours}</h1>
                <p>Hours worked this week</p>
              </Col>
              <Col>
                <h1>{internData.totalHours}</h1>
                <p>Hours worked total</p>
              </Col>
              <Col>
                <h1>{internComplete.length}</h1>
                <p>Tasks Completed</p>
              </Col>
              <Col>
                <h1>{Math.round(moment.duration(moment(new Date()).diff(internData.joined)).asDays())}</h1>
                <p>Days at CPMHA</p>
              </Col>
            </Row>     
            <InternForm 
              type={"edit"}
              id={internData._id}
            />{' '}
            <Button variant="info">Log Work Hours</Button>
          </Container>
        </Jumbotron>
        <Container fluid>
          <Row>
            <Col className="col-4">
              <Card>
                <Card.Body>
                  <Card.Title><h3>Intern Details</h3></Card.Title>
                    <p><strong>Email: </strong> {internData.email}</p>
                    <p><strong>School: </strong> {internData.school}</p>
                    <p><strong>Major: </strong> {internData.major}</p>
                    <p><strong>Joined: </strong> {moment(internData.joined).format('MMMM Do, YYYY')}</p>
                    <p><strong>Teams: {internTeams}</strong> </p>
                </Card.Body>
              </Card>
              <Card className="mt-5">
              <Card.Body>
                <Card.Title><h3>Other Interns</h3></Card.Title>
                  {this.state.interns.map((intern, i) => (
                    intern._id === this.state.internId ? '' : 
                    <div key={i}>
                      <Link to={{
                        pathname: '/interns/' + intern.name,
                        state: { id: intern._id }
                      }}>
                        {intern.name}
                      </Link>
                    </div>
                    ))
                  }
                    
              </Card.Body>
            </Card>
            </Col>
            <Col className="col-4 text-left scroll-column">
              <h2>Pending Tasks</h2>
              {internIncomplete.length > 0 ? internIncomplete.map((task, i) => (
              <div className="mt-3 mb-3" key={i}>
                <Task id={task._id} view={'other'}></Task>
                <hr/>
              </div>
            ))
            : <p>This intern currently has no pending tasks.</p>}
            </Col>
            <Col className="col-4 text-left scroll-column">
              <h2>Completed Tasks</h2>
              {internComplete.length > 0 ? internComplete.map((task, i) => (
              <div className="mb-5" key={i}>
                <Task id={task._id} view={'other'}></Task>
              </div>
            ))
            : <p>This intern has no completed tasks.</p>}
            </Col>
          </Row>
          <hr className="intern-hr"/>
          <Row className="m-5 justify-content-center">
             <Link to="/"><Button type="button" variant="danger"onClick={() => this.deleteInternFull(internData._id)}>Delete Intern</Button></Link>
          </Row>
        </Container>
        </>
        : 
        <h1>Loading</h1>}
      </div>
    )
  }
}

export default Intern;