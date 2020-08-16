import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <div>
        <h2>Home</h2>
      </div>
    )
  }
}

class About extends Component {
  render() {
    return (
      <div>
        <h2>About</h2>
      </div>
    );
  }
}
class Store extends Component {
  render() {
    console.log(this.props.match);
    return (
      <div>
        <h2>Store</h2>
        <h4>{this.props.match.params.item}</h4>
      </div>
    );
  }
}

class SimpleRouter extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route exact path="/store" component={Store} />
          <Route exact path="/store/:item" component={Store} />
        </div>
      </Router>
    )
  }
}

export default SimpleRouter;
