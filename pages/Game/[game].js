import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout'
import GameContainer from '../../components/GamePage/GameContainer';
import Announcements from '../../components/Announcements/Announcements';
import { withApollo } from '../../lib/apollo';
import cookie from 'js-cookie';

function GamePage(props) {
  const router = useRouter();
  const { game } = router.query;

  if (!cookie.get('token')) {
    if (typeof window !== 'undefined') {
        router.push('/')
        router.replace('/','/game/' + router.query.game)
    }
    
    return null
  }

  return (
    <Layout 
      main={false} 
      showGamesButton={true} 
      startGame={false} 
      submitGame={true} 
      clickEvent={() => router.push('/')}
    >
      <Announcements />
      <GameContainer 
        gameId={game} 
        redirect={(keepURL) => {
          router.push('/');
          console.log('redirect keepURL',keepURL)
          if (keepURL) {
            router.replace('/','/game/' + router.query.game);
          }
        }}
      />
      <br />
    </Layout>
  );
}

export default withApollo(GamePage);