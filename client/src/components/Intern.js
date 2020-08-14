import React, { Component } from 'react';
import axios from 'axios';
import InternForm from './InternForm';
import Header from './Header';
import { Link } from "react-router-dom";
import moment from 'moment';
import { Jumbotron, Container, Row, Button, Col, Card } from 'react-bootstrap';

import '../css/Intern.css';

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
  getIntern = () => {
    this.setState({ isLoading: true });
    axios.post(INTERN_GET_SINGLE_API, { id: this.state.internId })
      .then(res => {
        this.setState({ intern: res.data });
      })
      .then(() => {
        this.setState({ isLoading: false });
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

  render() {
    let internData = this.state.intern;
    let intern = null;

    
    if (!this.state.isLoading) {
      intern = (
        <>
        <Header/>
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
                <h1>{internData.tasks.length}</h1>
                <p>Tasks completed</p>
              </Col>
              <Col>
                <h1>{moment.duration(moment(new Date()).diff(internData.joined)).days()}</h1>
                <p>Days at CPMHA</p>
              </Col>
            </Row>     
            <InternForm 
              type={"edit"}
              id={internData._id}
            />{' '}
            <Link to="/"><Button type="button" variant="danger"onClick={() => this.deleteInternFull(internData._id)}>Delete Intern</Button></Link>
          </Container>
        </Jumbotron>
        <Card className="col 1" style={{width: "30%"}}>
          <Card.Body>
            <Card.Title>Intern Details</Card.Title>
            <Card.Text>
              <p><strong>Email: </strong> {internData.email}</p>
              <p><strong>School: </strong> {internData.school}</p>
              <p><strong>Major: </strong> {internData.major}</p>
              <p><strong>Joined: </strong> {moment(internData.joined).format('MMMM Do, YYYY')}</p>
              
            </Card.Text>
          </Card.Body>
        </Card>
        </>
      )
    }

    return (
      <div>
        {intern}
      </div>
    )
  }
}

export default Intern;