import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Registry from './Components/Registry/Registry'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={'/'} component={Registry} />
        </Switch>
      </BrowserRouter>
    )
  }
}

