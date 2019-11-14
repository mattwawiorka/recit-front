import React, { Component } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout/Layout'
import Game from '../components/GamePage/Game';
import Announcements from '../components/Announcements/Announcements';
import Filtering from '../components/Filtering/Filtering';
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
    <Layout startGame={false} submitGame={true} clickEvent={this.handleViewGames}>
      <Announcements />
      <Game gameId={gameId} />
      <Filtering />
    </Layout>
    );
  }
};

export default withApollo(GamePage);