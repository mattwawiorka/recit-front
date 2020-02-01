import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout'
import GameContainer from '../../components/GamePage/GameContainer';
import Announcements from '../../components/Announcements/Announcements';
import { withApollo } from '../../lib/apollo';
import withAuth from '../../lib/withAuth';

function GamePage(props) {
  const router = useRouter();
  const { game } = router.query;

  if (!props.auth.loggedIn()) {
    if (typeof window !== 'undefined') {
        router.push('/')
        router.replace('/','/game/' + router.query.game)
    }
    
    return null
  }

  // if (props.auth.loggedIn()) {
    return (
      <Layout main={false} showGamesButton={true} startGame={false} submitGame={true} clickEvent={() => router.push('/')}>
        <Announcements />
        <GameContainer gameId={game} currentUser={props.auth.getUser()} />
        <br />
      </Layout>
    );
  // } else {
  //   if (typeof window !== 'undefined') router.push('/')
  //   return null
  // }
  
}

export default withApollo(withAuth(GamePage));