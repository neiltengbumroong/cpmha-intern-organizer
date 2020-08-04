import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import InternForm from './InternForm';

class Interns extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
      <InternForm/>
      </>
    )
  }
}

export default Interns;