import React, { Component } from 'react';
import Router, { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout'
import GameContainer from '../../components/GamePage/GameContainer';
import Announcements from '../../components/Announcements/Announcements';
import Filtering from '../../components/Filtering/Filtering';
import { withApollo } from '../../lib/apollo';
import withAuth from '../../lib/withAuth';

const GamePage = props => {
  const router = useRouter();
  const { game } = router.query;
  return (
    <Layout main={true} showGamesButton={true} startGame={false} submitGame={true} clickEvent={handleViewGames}>
      <Announcements />
      <GameContainer gameId={game} currentUser={props.auth.getUser()} loggedIn={props.auth.loggedIn()} />
      <Filtering />
    </Layout>
  );
}

const handleViewGames = () => {
  Router.push('/');
}

// GamePagehooks.getInitialProps = () => {
//   console.log('this happens?')
//   const blart = 3;
//   return {blart: blart};
// }

export default withApollo(withAuth(GamePage));