import React from 'react';
import Home from './components/Home';
import Intern from './components/Intern';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/:internId' exact component={Intern}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
