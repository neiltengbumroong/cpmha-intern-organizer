import React from 'react';
import Home from './components/Home';
import Intern from './components/Intern';
import Team from './components/Team';
import Calendar from './components/Calendar';
import ContactList from './components/ContactList';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';


function App() {
  return (
    <>
    <div>
      <Router>
        <Switch>
          <Route exact path='/' exact component={Home}/>
          <Route exact path='/calendar' exact component={Calendar}/>
          <Route exact path='/interns/:internId' component={Intern}/>
          <Route exact path='/teams/:teamId' component={Team}/>
          <Route exact path='/ContactList' component={ContactList}/>
        </Switch>
      </Router>
    </div>
    </>
  );
}

export default App;
