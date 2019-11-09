import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import GamesLayout from '../components/Layout/GamesLayout'
import Game from '../components/GamePage/Game';
import { withApollo } from '../lib/apollo';

const GamePage = () => {
  const router = useRouter();
  const gameId = router.query.id;
  return (
  <GamesLayout>
    <br />
    <Game gameId={gameId} />
    <br /> 
  </GamesLayout>
  );
};

export default withApollo(GamePage);