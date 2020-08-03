import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TaskForm from './TaskForm';

import '../css/Tasks.css';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    }

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }



  handleOpenModal() {
    this.setState({ showModal: true });
  }
  
  handleCloseModal(event) {
    event.preventDefault();
    this.setState({ showModal: false });
  }

  render() {
     Modal.setAppElement('body');
    return (
      <>
      </>
    )
  }
}

export default Tasks;