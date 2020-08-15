import React from 'react';
import Home from './components/Home';
import Intern from './components/Intern';
import Team from './components/Team';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';


function App() {
  return (
    <>
    <div>
      <Router>
        <Switch>
          <Route exact path='/' exact component={withRouter(Home)}/>
          <Route exact path='/calendar' exact component={withRouter(Calendar)}/>
          <Route exact path='/interns/:internId' component={withRouter(Intern)}/>
          <Route exact path='/teams/:teamId' component={withRouter(Team)}/>
          
        </Switch>
      </Router>
    </div>
    </>
  );
}

export default App;
