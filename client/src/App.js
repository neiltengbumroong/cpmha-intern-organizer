import React from 'react';
import Home from './components/Home';
import Intern from './components/Intern';
import Team from './components/Team';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <>
    <div>
      <Router>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/calendar' exact component={Calendar}/>
          <Route path='/interns/:internId' exact component={Intern}/>
          <Route path='/teams/:teamId' exact component={Team}/>
        </Switch>
      </Router>
    </div>
    </>
  );
}

export default App;
