import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, Row, Container } from 'react-bootstrap';

import '../css/Main.css';

class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <Container className="mt-3 announce-container">
        <Row className="justify-content-between">
          <a className="btn btn-link" onClick={this.handleOpenModal}><strong>{this.props.subject}</strong> - {this.props.name}</a>
          <strong>{moment(moment(this.props.date).utc(), "YYYYMMDD").fromNow()}</strong>
        </Row>
        <div onClick={e => e.stopPropagation()}>
          <Modal
            show={this.state.showModal}
            onHide={this.handleCloseModal}
            keyboard={false}
            backdrop="static"
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.subject}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row className="justify-content-between mt-2">
                  <h5>{this.props.name}</h5>
                  <h5>{moment(this.props.date).format('MMMM Do YYYY, h:mm a')}</h5>
                </Row>        
              <p>{this.props.announcement}</p>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleCloseModal} variant="danger">Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
        
      </Container>
    )
  }
}

export default Announcement;