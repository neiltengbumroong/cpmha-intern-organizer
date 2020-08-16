import React, { Component } from 'react';
import axios from 'axios';
import { Form, Col, Button, Modal } from 'react-bootstrap';

class AnnounceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      announcement: '',
      date: new Date()
    }
  }
}

