import React, { Component } from 'react';
import Intern from './components/Intern';
import Team from './components/Team';
import Main from './components/Main';
import Calendar from './components/Calendar';
import ContactList from './components/ContactList';
import ErrorPage from './components/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized'
import Logout from './components/Logout';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import './css/Main.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false
    }
  }

  validateLogin = () => {
    this.setState({ user: true });
  }

  componentDidMount() {
    const remembered = localStorage.getItem('remember') === 'true';
    if (remembered) {
      this.setState({ user: true });
    } else {
      this.setState({ user: false });
    }
  }
  
  render() {
    return (
      <>
        <div>
          <Router>
            <Switch>
              <Route exact path='/' render={props => this.state.user ? <Main {...props} /> : <Login {...props} validateLogin={this.validateLogin}/>}/>
              <Route exact path="/logout" component={Logout}/>
              <ProtectedRoute exact path='/main' user={this.state.user} component={Main}/>
              <ProtectedRoute exact path='/calendar' user={this.state.user} component={Calendar}/>
              <ProtectedRoute exact path='/interns/:internId' user={this.state.user} component={Intern}/>
              <ProtectedRoute exact path='/teams/:teamId' user={this.state.user} component={Team}/>
              <ProtectedRoute exact path='/contactlist' user={this.state.user} component={ContactList}/>
              <Route exact path='/unauthorized' component={Unauthorized}/>
              <ProtectedRoute user={this.state.user} component={ErrorPage}/>       
            </Switch>
          </Router>
        </div>
      </>
    )
  }
  
}

export default App;
