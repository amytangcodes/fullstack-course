import React, { Component, Fragment } from 'react';

import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
} from '@material-ui/core';

export default class Pokemon extends Component {
  state = {
    base_exp: null,
    stats: []
  };

  componentDidMount() {
    const url = 'https://pokeapi.co/api/v2';
    fetch(`${url}/pokemon/${this.props.name}`)
      .then((res) => res.json())
      .then((data) => {
        const currentState = this.state;
        const nextState = {
          base_exp: data.base_experience,
          stats: data.stats.map((stat) => {
            return {
              value: stat.base_stat,
              name: stat.stat.name,
              url: stat.stat.url,
            };
          })
        };

        this.setState(Object.assign({}, currentState, nextState));
      });
  }

  render() {
    const { name } = this.props;
    const { base_exp } = this.state;

    return (
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              {name[0].toUpperCase()}
            </Avatar>
          }

          title={name}
          subheader={`Base Experience: ${base_exp}`}
        />
        <CardContent>
          {
            // all the stats
            this.state.stats.map((stat) => {
              return (
                <Fragment key={stat.url}>
                  <Typography>
                    {stat.name}
                  </Typography>
                  <Typography>
                    {stat.value}
                  </Typography>
                  <Typography>
                    {stat.url}
                  </Typography>
                </Fragment>
              );
            })
          }
        </CardContent>
      </Card>
    )
  }
}
