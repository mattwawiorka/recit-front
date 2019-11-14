import React, { Component } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout/Layout';
import GamesLayout from '../components/Layout/GamesLayout'
import Game from '../components/GamePage/Game';
import { withApollo } from '../lib/apollo';

class GamePage extends Component {
  constructor(props) {
    // props
    super(props)
    // state
    this.state = {
      viewGames: false
    };
  }

  handleViewGames = () => {
    Router.push('/');
  }

  render() {
    const gameId = Router.query.id;
    return (
    <GamesLayout startGame={false} submitGame={true} clickEvent={this.handleViewGames}>
      <br />
      <Game gameId={gameId} />
      <br /> 
    </GamesLayout>
    );
  }
};

export default withApollo(GamePage);