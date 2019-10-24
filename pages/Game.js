import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import GamePage from '../components/GamePage/GamePage';

const Game = () => {
  const router = useRouter();
  const gameId = router.query.id;
  return (
  <Layout>
      <GamePage gameId={gameId} />
  </Layout>
  );
};

export default Game;