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
      </div>
    );
  }
}

class SimpleRouter extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/store">Store</Link></li>
          </ul>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/store" component={Store} />
        </div>
      </Router>
    )
  }
}

export default SimpleRouter;
