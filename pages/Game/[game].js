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

  if (props.auth.loggedIn()) {
    return (
      <Layout main={true} showGamesButton={true} startGame={false} submitGame={true} clickEvent={handleViewGames}>
        <Announcements />
        <GameContainer gameId={game} currentUser={props.auth.getUser()} />
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

export default withApollo(withAuth(GamePage));