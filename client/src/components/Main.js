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

const ANNOUNCEMENT_GET_RECENT_API = 'http://localhost:5000/api/announcements/get-recent';
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

  loadTask = () => {
    axios.get(TASK_GET_API)
      .then(res => {
        this.setState({
          tasks: res.data
        })
      })
  }

  loadData = () => {
    axios.all([
      axios.get(TEAM_GET_API),
      axios.get(INTERN_GET_API),
      axios.get(ANNOUNCEMENT_GET_RECENT_API),
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
        <Container className="pb-5" fluid>
          <Row className="pt-4">
            <Col sm={12} md={9} className="pl-5 pr-5 announcements-scroll">
              <Row className="justify-content-between mb-2">
                <h2>Announcements</h2>
                <AnnounceForm updateMain={this.loadData}/>
              </Row>
              <Row className="mb-5">
              {this.state.announcements ? 
                this.state.announcements.map((announcement, i) => ( 
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
              <hr/>
              <Row className="mt-5 mb-5 justify-content-between">
                <h2>Tasks</h2>
                <TaskForm type="create" updateParent={this.loadTask}/>
              </Row>
              <Row className="mb-4">
                <Col sm={12} md={6} className="text-left scroll-column">
                  <h3 className="text-center">Pending</h3>
                  {incompleteTasks.length > 0 ? incompleteTasks.slice(0).reverse().map((task, i) => (
                  <div className="mt-3 mb-3" key={i}>
                    <Task updateParent={this.loadTask} id={task._id} view={'main'}></Task>
                  </div>
                  ))
                  : <p className="text-center">There are currently has no pending tasks.</p>}
                </Col>
                <Col sm={12} md={6} className="text-left scroll-column">
                  <h3 className="text-center">Completed</h3>
                  {completeTasks.length > 0 ? completeTasks.slice(0).reverse().map((task, i) => (
                  <div className="mb-5" key={i}>
                    <Task updateParent={this.loadTask} id={task._id} view={'main'}></Task>
                  </div>
                  ))
                  : <p className="text-center">There are no completed tasks.</p>}
                </Col>
              </Row>            
            </Col>
            <Col sm={12} md={3}>
              <Card className="mb-3 text-left">
                <InternForm updateParent={this.loadData} type="create"/>
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
                <TeamForm updateParent={this.loadData} type="create"/>
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
              <Card className="mb-3 text-left">
                <Card.Body>
                  <Card.Title><h3>Known Issues</h3></Card.Title>
                  <p>- Deleting an intern who is currently leading a team will cause an error</p>
                  <p>- Some pages won't update after user action (editing, submitting, etc.), simply refresh page but please still document below</p>
                  <a href="https://docs.google.com/document/d/1DKajjcdVYzG0nmLjwyYfKFkQBSFlJVDN6W6F2jAfpQA/edit" className="btn-link">https://docs.google.com/document/d/1DKajjcdVYzG0nmLjwyYfKFkQBSFlJVDN6W6F2jAfpQA/edit</a>
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