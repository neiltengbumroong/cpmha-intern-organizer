import React, { Component } from 'react';
import axios from 'axios';
import Task from './Task';
import Announcement from './Announcement';
import InternForm from './InternForm';
import TeamForm from './TeamForm';
import TaskForm from './TaskForm';
import AnnounceForm from './AnnounceForm';
import { Card, Container, Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../css/Main.css';

const ANNOUNCEMENT_GET_API = 'http://localhost:5000/api/announcements/get';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';
const TASK_GET_API = 'http://localhost:5000/api/tasks/get';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: true,
      announcements: [],
      interns: [],
      teams: [],
      tasks: []
    }
  }

  loadData = () => {
    axios.all([
      axios.get(TEAM_GET_API),
      axios.get(INTERN_GET_API),
      axios.get(ANNOUNCEMENT_GET_API),
      axios.get(TASK_GET_API)
    ])
      .then(res => {
        this.setState({
          teams: res[0].data,
          interns: res[1].data,
          announcements: res[2].data,
          tasks: res[3].data
        })
      })   
  }


  updateMain = () => {
    console.log("main updated");
    this.setState({ update: true });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    let completeTasks = [];
    let incompleteTasks = [];

    this.state.tasks.forEach(task => {
      if (task.completed) {
        completeTasks.push(task);
      } else {
        incompleteTasks.push(task);
      }
    });


    return (
      <div className="main-background">
        <Container fluid>
          <Row className="pt-4">
            <Col md={8} className="ml-5 mr-5">
              <Row className="justify-content-between mb-2">
                <h2>Announcements</h2>
                <AnnounceForm/>
              </Row>
              <Row>
              {this.state.announcements ? 
                this.state.announcements.slice(0).reverse().map((announcement, i) => (   
                  <Announcement
                    key={i}
                    subject={announcement.subject}
                    name={announcement.name}
                    announcement={announcement.announcement}
                    date={announcement.date}
                  />
                ))
                : null
              }
              </Row>
              <Row className="mt-5 mb-5 justify-content-center">
                <TaskForm/>
              </Row>
              <Row >
                <Col md={6} className="text-left scroll-column">
                  <h3 className="text-center">Pending Tasks</h3>
                  {incompleteTasks.length > 0 ? incompleteTasks.map((task, i) => (
                  <div className="mt-3 mb-3" key={i}>
                    <Task id={task._id} view={'main'}></Task>
                  </div>
                  ))
                  : <p>There are currently has no pending tasks.</p>}
                </Col>
                <Col md={6} className="text-left scroll-column">
                  <h3 className="text-center">Completed Tasks</h3>
                  {completeTasks.length > 0 ? completeTasks.map((task, i) => (
                  <div className="mb-5" key={i}>
                    <Task id={task._id} view={'main'}></Task>
                  </div>
                  ))
                  : <p>There are no completed tasks.</p>}
                </Col>
              </Row>
              
            </Col>
            <Col md={3}>
              <Card className="mb-3 text-left">
                <InternForm type="create"/>
                <Card.Body>
                  <Card.Title><h3>Interns</h3></Card.Title>
                  {this.state.interns.map((intern, i) => (
                    <div key={i} className="pb-1">
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
              <Card className="mb-3 text-left">
                <TeamForm type="create"/>
                <Card.Body>
                  <Card.Title><h3>Teams</h3></Card.Title>
                  {this.state.teams.map((team, i) => (
                    <div key={i} className="pb-1">
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
          </Row> 
        </Container>
      </div>
      
    )
  }
}

export default Main;