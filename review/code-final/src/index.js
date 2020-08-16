import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//
// NOTE: To run these examples comment out the line
// which "renders" the `<Root />` component, and
// and uncomment the matching example component line.
//

import Example1 from './route-examples/example1';
import Example2 from './route-examples/example2';
import Example3 from './route-examples/example3';
import Example4 from './route-examples/example4';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import {
  Grid,
} from '@material-ui/core';

import Pokemon from './pokemon/Pokemon';

class Root extends Component {
  state = {
    pokemon: [

    ]
  };

  componentDidMount() {
    fetch(`https://pokeapi.co/api/v2/pokemon`)
      .then((response) => response.json())
      .then((data) => {
        const currentState = this.state;
        this.setState(
          Object.assign(
            {},
            currentState,
            { pokemon: data.results }
          )
        );
      });
  }

  render() {
    const { pokemon } = this.state;

    return (
      <Router>
        <Route exact path='/' render={() => {
          return (
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Grid container justify="center" spacing={16}>
                  {
                    pokemon.map((poke) => {
                      return (
                        <Grid key={poke.url} item>
                          <Pokemon
                            name={poke.name}
                            url={poke.url}
                          />
                        </Grid>
                      );
                    })
                  }
                </Grid>
              </Grid>
            </Grid>
          );
        }}/>
        <Route
          exact
          path='/pokemon/:name'
          render={(props) => <Pokemon name={props.match.params.name}/>}
        />
      </Router>
    )
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));

// ReactDOM.render(<Example1 />, document.getElementById('root'));
// ReactDOM.render(<Example2 />, document.getElementById('root'));
// ReactDOM.render(<Example3 />, document.getElementById('root'));
// ReactDOM.render(<Example4 />, document.getElementById('root'));
