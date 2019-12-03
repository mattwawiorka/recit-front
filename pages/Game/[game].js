import Router, { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout'
import GameContainer from '../../components/GamePage/GameContainer';
import Announcements from '../../components/Announcements/Announcements';
import Filtering from '../../components/Filtering/Filtering';
import { withApollo } from '../../lib/apollo';
import { useContext } from 'react';
import AuthContext from '../../lib/AuthContext';

const GamePage = props => {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const { game } = router.query;

  console.log('auth',auth)

  if (auth.loggedIn) {
    return (
      <Layout main={true} showGamesButton={true} startGame={false} submitGame={true} clickEvent={handleViewGames}>
        <Announcements />
        <GameContainer gameId={game} currentUser={auth.user} />
        <Filtering />
      </Layout>
    );
  } else {
    if (typeof window !== 'undefined') router.push('/')
    return null
  }
  
}

const handleViewGames = () => {
  Router.push('/');
}

export default withApollo(GamePage);