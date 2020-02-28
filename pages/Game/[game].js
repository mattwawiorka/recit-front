import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout'
import GameContainer from '../../components/GamePage/GameContainer';
import { withApollo } from '../../lib/apollo';
import cookie from 'js-cookie';
import Loading from '../../components/Loading/Loading';

function GamePage(props) {
  const router = useRouter();
  const { game } = router.query;

  if (!cookie.get('token')) {
    if (typeof window !== 'undefined') {
        router.push('/')
        router.replace('/','/game/' + router.query.game)
    }
    
    return null;
  }

  return (
    <Layout 
      main={false} 
      showGamesButton={true} 
      startGame={false} 
      submitGame={true} 
      clickEvent={() => router.push('/')}
    >
      <br />
      <GameContainer 
        gameId={game} 
        redirect={() => {
          router.push('/');
        }}
      />
      <br />
    </Layout>
  );
}

export default withApollo(GamePage);