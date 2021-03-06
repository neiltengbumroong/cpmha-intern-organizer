import React, { Component } from 'react';
import axios from 'axios';
import Task from './Task';
import Announcement from './Announcement';
import InternForm from './InternForm';
import TeamForm from './TeamForm';
import TaskForm from './TaskForm';
import Header from './Header';
import AnnounceForm from './AnnounceForm';
import Loader from './Loader';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import * as API from '../utils/api';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: true,
      announcements: [],
      interns: [],
      teams: [],
      tasks: [],
      taskLoading: true,
      isLoading: true
    }
  }

  loadTask = () => {
    this.setState({
      tasks: [],
      taskLoading: true
    }, () => {
      axios.get(API.TASK_GET_API)
      .then(res => {
        this.setState({
          tasks: res.data,
          taskLoading: false
        })
      })
    }) 
  }

  loadData = () => {
    this.setState({
      isLoading: true,
      interns: [],
      teams: [],
      tasks: [],
      announcements: []
    }, () => {
      axios.all([
      axios.get(API.TEAM_GET_API),
      axios.get(API.INTERN_GET_API),
      axios.get(API.ANNOUNCEMENT_GET_RECENT_API),
      axios.get(API.TASK_GET_API)
    ])
      .then(res => {
        this.setState({
          teams: res[0].data,
          interns: res[1].data,
          announcements: res[2].data,
          tasks: res[3].data,
          isLoading: false
        })
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
        <Header/>
        <Container className="pb-5 pl-4" fluid>
          <Row className="pt-4">
            <Col sm={12} md={9}>
              <Container className="bg-white mb-5 pl-4 pr-4 pt-3 border" fluid>
                <Row className="justify-content-between ml-1 mb-2">
                  <h2>Announcements</h2>
                  <AnnounceForm updateMain={this.loadData}/>
                </Row>
                <hr/>
                <Row className="mb-5 ml-1 mr-2">
                {!this.state.isLoading ? 
                  this.state.announcements.map((announcement, i) => ( 
                    <Announcement
                      key={i}
                      subject={announcement.subject}
                      name={announcement.name}
                      announcement={announcement.announcement}
                      date={announcement.date}
                    />
                  ))
                  : <Col className="align-items-center"><Loader/></Col>
                }
                </Row>
              </Container>
              <Container className="bg-white pl-4 pr-4 border">
                <Row className="pt-4 ml-2 justify-content-between">
                  <h2>Tasks</h2>
                  <TaskForm type="create" updateParent={this.loadTask}/>
                </Row>
                <hr/>
                <Row className="mb-4">
                  <Col sm={12} md={6} className="text-left scroll-column border-right">
                    <h3 className="text-center">Pending</h3>
                    <hr/>
                    {!this.state.isLoading ? (incompleteTasks.length > 0 ? incompleteTasks.slice(0).reverse().map((task, i) => (
                    <div className="mt-3 mb-3" key={i}>
                      <Task updateParent={this.loadTask} id={task._id} view={'main'}></Task>
                    </div>
                    ))
                    : <p className="text-center mt-3">There are currently no pending tasks.</p>) : <Loader/>}
                  </Col>
                  <Col sm={12} md={6} className="text-left scroll-column">
                    <h3 className="text-center">Completed</h3>
                    <hr/>
                    {!this.state.isLoading ? (completeTasks.length > 0 ? completeTasks.slice(0).reverse().map((task, i) => (
                    <div className="mb-5" key={i}>
                      <Task updateParent={this.loadTask} id={task._id} view={'main'}></Task>
                    </div>
                    ))
                    : <p className="text-center mt-3">There are currently no completed tasks.</p>) : <Loader/>}
                  </Col>
                </Row>
              </Container>            
            </Col>
            <Col sm={12} md={3}>
              <Card className="mb-3 text-left">
                <InternForm updateParent={this.loadData} type="create"/>
                <Card.Body>
                  <Card.Title><h3>Interns</h3></Card.Title>
                  {!this.state.isLoading ? this.state.interns.map((intern, i) => (
                    <div key={i} className="pb-1">
                      <Link to={{
                        pathname: '/interns/' + intern.name.replace(/\s/g, ""),
                        state: { id: intern._id }
                      }}>
                        {intern.name}
                      </Link>
                    </div>
                    ))
                    : <Loader/>
                  }
                </Card.Body>
              </Card>
              <Card className="mb-3 text-left">
                <TeamForm updateParent={this.loadData} type="create"/>
                <Card.Body>
                  <Card.Title><h3>Teams</h3></Card.Title>
                  {!this.state.isLoading ? this.state.teams.map((team, i) => (
                    <div key={i} className="pb-1">
                      <Link className="team-link" to={{
                        pathname: '/teams/' + team.name.replace(/\s/g, ""),
                        state: { id: team._id }
                      }}>
                        {team.name}
                      </Link>
                    </div>
                    ))
                    :
                    <Loader/>
                  }    
                </Card.Body>
              </Card>
              <Card className="mb-3 text-left">
                <Card.Body>
                  <Card.Title><h3>Known Issues</h3></Card.Title>
                  <p>- Deleting an intern who is currently leading a team will cause an error</p>
                  <a href="https://docs.google.com/document/d/1DKajjcdVYzG0nmLjwyYfKFkQBSFlJVDN6W6F2jAfpQA/edit" target ="_blank" rel="noopener noreferrer" className="btn-link">https://docs.google.com/document/d/1DKajjcdVYzG0nmLjwyYfKFkQBSFlJVDN6W6F2jAfpQA/edit</a>
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