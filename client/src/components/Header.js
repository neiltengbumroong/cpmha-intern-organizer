import React, { Component } from 'react';
import { Container, Row, Col, Image, Button, ButtonToolbar } from 'react-bootstrap';
import Logo from '../images/CPMHA-logo-final.png';
import { Link } from 'react-router-dom';

class Header extends Component {

  handleLogOut = () => {
    localStorage.setItem('remember', false);
  }

  render() {
    return (
      this.props.auth === false ? 
        <Container className="header-bg" fluid>
          <Row className="pb-3 pt-3 m-auto text-center">
            <Col>
              <Link to="/"><Image className="img-responsive" src={Logo}></Image></Link>
            </Col>      
          </Row>
        </Container>
        :
        <Container className="header-bg" fluid>
          <Row className="pb-3 pt-3 m-auto justify-content-center">
            {this.props.auth === false ? 
              <Col>
                <Image className="img-responsive center-block" src={Logo}></Image>
              </Col>
              :
              <>
              <Col md={5} sm={12}>
                <Link to="/main"><Image className="img-responsive" src={Logo}></Image></Link>
              </Col>
              <Col md={6} sm={12} className="mt-auto mb-auto text-center">
                <ButtonToolbar className="header-button-toolbar">
                  <Link to="/"><Button variant="cpmha-dark-purple" className="mr-1 mb-2">Home</Button></Link>
                  <Link to="/calendar"><Button variant="cpmha-dark-purple" className="mr-1 mb-2">Calendar</Button></Link>
                  <Link to="/contactlist"><Button variant="cpmha-dark-purple" className="mr-1 mb-2">Contact List</Button></Link>
                  <a href="https://concussionspainmentalhealth.com/" target="_blank" rel="noopener noreferrer"><Button variant="cpmha-dark-purple" className="mr-1 mb-2">CPMHA Site</Button></a>
                  <a href="https://drive.google.com/drive/folders/1NBTSBZjj27tcAtP_-PUA5j0puta_aXzY?usp=sharing" target="_blank" rel="noopener noreferrer"><Button variant="cpmha-dark-purple" className="mr-1 mb-2">Google Drive</Button></a>
                  {/* <Link to="/logout"><Button onClick={this.handleLogOut} variant="cpmha-dark-purple" >Log Out</Button></Link> */}
                </ButtonToolbar>           
              </Col>
              </>
            }        
          </Row>
        </Container>
    )
  }
}

export default Header;