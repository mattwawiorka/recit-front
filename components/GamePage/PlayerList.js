import { useQuery, useMutation } from '@apollo/react-hooks';
import Loading from '../Loading/Loading';
import gql from 'graphql-tag';
import Link from 'next/link';

const GET_PLAYERS = gql`
  query Players($gameId: ID!) {
    players(gameId: $gameId) {
      id
      name
      role
    }
  }
  `;

const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!) {
    joinGame(gameId: $gameId) {
      id
    }
  }
  `;

const LEAVE_GAME = gql`
  mutation LeaveGame($gameId: ID!) {
    leaveGame(gameId: $gameId) {
      id
    }
  }
  `;

function PlayerList(props) {
  let variables, host, spots, joinButton, inviteButton;

  variables = { 
    gameId: props.gameId
  }

  const { data, loading, error, refetch } = useQuery(GET_PLAYERS, { variables: variables }); 
  const [joinGame] = useMutation(JOIN_GAME, { variables: variables });
  const [leaveGame] = useMutation(LEAVE_GAME, { variables: variables });
  if (loading) return <Loading />
  if (error) return <h4>ERROR!!!</h4>

  const openSpots = props.spots - data.players.length;
        
  const rows = [];
  data.players.map((player) => {
    if (player.role === 1) {
      host = player;
    }
    rows.push(
      <React.Fragment key={player.id}>
        <Link href='/Profile/[user]' as={`/Profile/${player.id}`}>
          <div className="player">
            <h3>{player.name}</h3>
          </div>
        </Link>

        <style jsx>{`
          .player:hover {
            background-color: white;
            color: var(--greenapple);
            cursor: pointer;
            transform: scale(0.97);
            border-radius: 15px;
          }
        `}</style>

      </React.Fragment>
    );
  });

  let playerFound = data.players.some(player => {
    return player.id == props.currentUser;
  });

  if (openSpots === 0) {
    spots = <h4>Game is Full</h4>
  } 
  else if (openSpots === 1) {
    spots = <h4>1 Spot Left</h4>
  }
  else {
    spots = <h4>Open Spots: {openSpots}</h4>
  }

  const btnStyle = 
    <style jsx="true">{`
      .btn {
        width: 100%;
        height: 2em;
        margin-top: 1em;
      }
    `}</style>

  
  if (playerFound && !props.isHost) {
    joinButton = 
    <React.Fragment> 
      <button 
        onClick={() => {
          leaveGame()
          .then(response => {
            refetch();
          }) 
        }} 
        className="btn"
      >Leave Game</button>
      {btnStyle}
    </React.Fragment>
  } 
  else if (props.currentUser && openSpots > 0 && !props.isHost) {
    joinButton = 
    <React.Fragment> 
      <button 
        onClick={() => {
          joinGame()
          .then(response => {
            refetch();
          }) 
        }} 
        className="btn"
      >Join Game</button>
      {btnStyle}
    </React.Fragment>
  }
  else if (props.invited) {
    joinButton = 
    <React.Fragment> 
      <Link href={`/Signup?invited=true&game=${props.gameId}`}>
        <button className="btn">Join Game</button>
      </Link>
      {btnStyle}
    </React.Fragment>
  }
  else {
    joinButton = null;
  }

  if (!props.invited) {
    inviteButton = 
      <React.Fragment>
        <button onClick={props.toggleInvite} className="btn">Invite Players</button>
        {btnStyle}
      </React.Fragment>
  }
  else {
    inviteButton = null;
  }

  return (
    <React.Fragment>
      <div className="container">
        <div className='host'>  
          <h3>Hosted by {host.name}</h3>
        </div>
        <div className="players">
          <h3 style={{ textDecoration: 'underline' }}>Players</h3>
          {rows}
        </div>
        <div className="spots">
          {spots}
        </div>
        <div className="button">
          {joinButton}
          {inviteButton}
        </div>
      </div>

      <style jsx>{`
        .container {
          display: block;
          align-items: center;
          background-color: var(--greenapple); /* Orange */
          color: white;
          max-width: 20vw;
          width: 100%;
          height: auto;
          // height: 85%;
          border-radius: 15px;
          margin: auto;
          margin-top: 2em;
          padding: 1em;
          justify-items: center;
          // overflow: auto;
        }

        .players {
          padding-top: 1.5em;
          text-align: center;
          margin-bottom: 1.5em;
        }

        .spots {
          padding-top: 1em;
          text-align: center;
          margin-bottom: 1em;
          text-align: center;
        }

      `}</style>
    </React.Fragment>
  );
}

export default PlayerList;