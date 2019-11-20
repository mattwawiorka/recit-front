import React, { Component } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout/Layout'
import GameContainer from '../components/GamePage/GameContainer';
import Announcements from '../components/Announcements/Announcements';
import Filtering from '../components/Filtering/Filtering';
import { withApollo } from '../lib/apollo';
import withAuth from '../lib/withAuth';

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
    // Gives bottom game button power to leave game page
    Router.push('/');
  }

  render() {
    const gameId = Router.query.id;
    return (
    <Layout showGamesButton={true} startGame={false} submitGame={true} clickEvent={this.handleViewGames}>
      <Announcements />
      <GameContainer gameId={gameId} canEdit={false} />
      <Filtering />
    </Layout>
    );
  }
};

export default withApollo(withAuth(GamePage));