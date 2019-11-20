import Loading from '../Loading/Loading';
import GameInfo from './GameInfo';
import PlayerList from './PlayerList';
import Discussion from './Discussion';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_GAME = gql`
  query Game($id: ID!) {
    game(id: $id) {
        id
        title
        dateTime
        endDateTime
        venue
        address
        sport
        description
        players
    }
  }
  `;

const GameContainer = (props) => {

  return (
    <React.Fragment>
    <Query query={GET_GAME} variables={{ id: props.gameId }}>
    { ({ loading, error, data }) => 
    {
      if (loading) return <Loading></Loading>
      if (error) return <h4>ERROR!!!</h4>

      return (
        <div className="container">
          <div className="gameInfo">
            <GameInfo game={data.game} />
          </div>
          
          <div className="players">
            <PlayerList gameId={props.gameId} playerSpots={data.game.players} />
          </div>
          
          <div className="discussion">
            <Discussion gameId={props.gameId} currentUser={props.currentUser}/>
          </div>
        </div>
      )
    
    }
    }
    </Query>
    

    <style jsx>{`
      .container {
        display: grid;
        max-width: 60vw;
        // max-height: 82vh;
        justify-items: center;
        grid-template-columns: 43vw 17vw;
        grid-template-rows: minmax(min-content, max-content) minmax(min-content, auto);
        grid-template-areas:
          "gameInfo players"
          "discussion discussion";
      }

      .gameInfo {
        width: 100%;
        height: auto;
        grid-area: gameInfo;
      }

      .players {
        width: 100%;
        height: 100%;
        grid-area: players;
        overflow: hidden;
      }

      .discussion {
        margin-top: 1em;
        width: 100%;
        height: 100%;
        grid-area: discussion;
      }

    `}</style>
    </React.Fragment>
  );
      
}

export default GameContainer;