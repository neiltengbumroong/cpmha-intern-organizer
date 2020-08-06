import React from 'react';
import Home from './components/Home';
// import Intern from './components/Intern';
import { BrowserRouter as Router, Route} from 'react-router-dom';


function App() {
  return (
    <div>
      <Router>
        <Route path='/' component={Home}/>
        {/* <Route path='/:internId' component={Intern}/> */}
      </Router>
    </div>
  );
}

export default App;
