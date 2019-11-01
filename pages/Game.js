import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import Game from '../components/GamePage/Game';
import { withApollo } from '../lib/apollo';

const GamePage = () => {
  const router = useRouter();
  const gameId = router.query.id;
  return (
  <Layout>
      <Game gameId={gameId} />
  </Layout>
  );
};

export default withApollo(GamePage);