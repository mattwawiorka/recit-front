import { useRouter } from 'next/router';
import GamesLayout from '../components/GamesLayout/GamesLayout';
import GamePage from '../components/GamePage/GamePage';

const Game = () => {
  const router = useRouter();
  return (
  <GamesLayout>
      <GamePage gameId={router.query.id} />
  </GamesLayout>
  );
};

export default Game;