###### [[Module Home](README.md)]

# React Router

[React Router](https://reacttraining.com/react-router/) is a collection of navigational components that allow you to create links to different parts of your application. This allows you to turn your single page applications into multi-page applications.

React Router allows for the specification of paths which essentially maps to where your website URL is pointing. For example, appending `/about` to your URL is pointing to a unique page. You can then specify the component that should be shown when the URL is pointing to that page. 

## Installation

In order to begin using React Router, you must ensure that it is installed within your project. This can be done using npm. Run the following command from inside of your command line:

```shell
npm install --save react-router-dom
```

_Note: You may find tutorials online that suggest installing react-router. react-router contains all of the shared components between react-router-dom and react-router-native. Prior to the creation of React Native, react-router alone would have served our needs for using router on the web, however, react-router-dom will now have everything that we need._


## Simple Routes

```jsx
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

class SimpleRouter extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/store" component={Store} />
        </div>
      </Router>
    )
  }
}
```

## Route Params

In the example above, you may have noticed that irrespective of which page you tried to navigate to, the home page continued to try to be rendered. This is due to the fact that the lone slash (`/`) is a character within each of the other paths. This can be fixed by using the `exact` keyword to indicate that the Home component should only be rendered if the URL path that is being hit is specifically the single slash.

You are also able to specify parameters that you would like to pass to each unique path in your application. These params can then be displayed within the component. 

```jsx
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

class SimpleRouter extends Component {
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
```

An example of this in a real world application could be an online store. For example, you might be selling sweaters and want to be able to access more information about the sweater when you click on it (such as material, sizes, etc). The ID of the sweater can be passed in the URL and then accessed from the `params` object within the component itself. This can then be used to do an API call to look up the sweater by ID within the sweater view component. 

## Route Links

Sometimes, we would like to have a nav bar that persists across several of our routes! We can use the `Link` component to accomplish this. 

```jsx
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

class SimpleRouter extends Component {
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
```

This will persist the navigation bar consisting of links to Home, About, and Store throughout our application.

### Resource Example
_The following is an example from the React Router docs on utilizing routes and links._

```jsx
class BasicExample extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
        </div>
      </Router>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <h2>Home</h2>
      </div>
    );
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

class Topics extends Component {
  render() {
    const { match } = this.props;
    return (
      <Router>
        <div>
          <h2>Topics</h2>
          <ul>
            <li>
              <Link to={`${match.url}/rendering`}>Rendering with React</Link>
            </li>
            <li>
              <Link to={`${match.url}/components`}>Components</Link>
            </li>
            <li>
              <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
            </li>
          </ul>

          <Route path={`${match.path}/:topicId`} component={Topic} />
          <Route
            exact
            path={match.path}
            render={() => <h3>Please select a topic.</h3>}
          />
        </div>
      </Router>
    );
  }
}

class Topic extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <h3>{match.params.topicId}</h3>
      </div>
    );
  }
}
```