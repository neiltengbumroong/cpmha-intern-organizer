import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TeamForm from './TeamForm';

class Teams extends Component {
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
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    Modal.setAppElement('body');
    return (
      <>
        <TeamForm/>
      </>
    )
  }
}

export default Teams;