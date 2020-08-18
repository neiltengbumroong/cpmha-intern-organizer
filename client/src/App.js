import React from 'react';
import Intern from './components/Intern';
import Team from './components/Team';
import Main from './components/Main';
import Calendar from './components/Calendar';
import ContactList from './components/ContactList';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/Main.css';


function App() {
  return (
    <>
    <div>
      <Router>
        <Switch>
          <Route exact path='/' component={Main}/>
          <Route exact path='/calendar' component={Calendar}/>
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
