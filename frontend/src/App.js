import React, {Fragment} from 'react'
import './App.css';
// routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
    <Fragment>
      <section className="ui container mt-5">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </section>
    </Fragment>
  </Router>
  );
}

export default App;
