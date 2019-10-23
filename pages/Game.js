import { useRouter } from 'next/router';
import GamesLayout from '../components/GamesLayout/GamesLayout';
import GamePage from '../components/GamePage/GamePage';

const Game = () => {
  const router = useRouter();
  const gameId = router.query.id;
  return (
  <GamesLayout>
      <GamePage gameId={gameId} />
  </GamesLayout>
  );
};

export default Game;