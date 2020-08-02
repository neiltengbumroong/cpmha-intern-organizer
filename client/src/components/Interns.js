import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import InternForm from './InternForm';

class Interns extends Component {
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
      <button onClick={this.handleOpenModal}>Add Intern</button>
      <Modal
          style={{
            content: {
              left: '20%',
              right: '20%',
              top: '15%',
              bottom: '15%',
            },
            overlay: {}
          }}
          isOpen={this.state.showModal}
          contentLabel="Create Task Modal"
        >
          <InternForm close={this.handleCloseModal}/>
        </Modal>
      </>
    )
  }
}

export default Interns;