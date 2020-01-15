import { useQuery, useMutation } from '@apollo/react-hooks';
import Loading from '../Loading/Loading';
import gql from 'graphql-tag';
import Link from 'next/link';
import PlayerList from './PlayerList';

const GET_PLAYERS = gql`
  query Players($gameId: ID!) {
    players(gameId: $gameId) {
      userId
      name
      role
    }
  }
`;

const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!, $conversationId: ID!) {
    joinGame(gameId: $gameId, conversationId: $conversationId) {
      userId
      name
      role
    }
  }
`;

const LEAVE_GAME = gql`
  mutation LeaveGame($gameId: ID!, $conversationId: ID!) {
    leaveGame(gameId: $gameId, conversationId: $conversationId) {
      userId
    }
  }
`;

const PLAYER_JOINED = gql`
  subscription PlayerJoined($gameId: ID!) {
    playerJoined(gameId: $gameId) {
      userId
      name
      role
    }
  }
`;

const PLAYER_LEFT = gql`
  subscription PlayerLeft($gameId: ID!) {
    playerLeft(gameId: $gameId) {
      userId
    }
  }
`;

function Players(props) {
  let variables, spotsMessage, joinButton, inviteButton;

  variables = { 
    gameId: props.gameId,
    conversationId: props.conversationId
  }

  const { data, loading, error, subscribeToMore } = useQuery(GET_PLAYERS, { variables: variables }); 
  const [joinGame] = useMutation(JOIN_GAME, { variables: variables });
  const [leaveGame] = useMutation(LEAVE_GAME, { variables: variables });
  if (loading) return <Loading />
  if (error) return <h4>ERROR!!!</h4>

  const openSpots = props.spots - data.players.length;

  if (props.isOver) {
    spotsMessage = null
  }
  else if (openSpots === 0) {
    spotsMessage = <h4>Game is Full</h4>
  } 
  else if (openSpots === 1) {
    spotsMessage = <h4>1 Spot Left</h4>
  }
  else {
    spotsMessage = <h4>Open Spots: {openSpots}</h4>
  }

  let playerFound = data.players.some(player => {
    return player.userId == props.currentUser;
  });

  const btnStyle = 
    <style jsx="true">{`
      .btn {
        width: 55%;
        // width: 7em;
        height: 2em;
        margin-top: 1em;
      }
    `}</style>

  // Determine Join Button
  if (props.isOver || props.isHost) {
    joinButton = null;
  }
  else if (playerFound) {
    joinButton = 
    <React.Fragment key="join"> 
      <button 
        onClick={() => {
          leaveGame()
          .then(response => {
            console.log(response)
          }) 
        }} 
        className="btn"
      >Leave Game</button>
      {btnStyle}
    </React.Fragment>
  } 
  else if (props.currentUser && openSpots > 0) {
    joinButton = 
    <React.Fragment key="join"> 
      <button 
        onClick={() => {
          joinGame()
          .then(response => {
            console.log(response)
          }) 
        }} 
        className="btn"
      >Join Game</button>
      {btnStyle}
    </React.Fragment>
  }
  else if (props.invited) {
    joinButton = 
    <React.Fragment key="join"> 
      <Link href={`/Signup?invited=true&game=${props.gameId}`}>
        <button className="btn">Join Game</button>
      </Link>
      {btnStyle}
    </React.Fragment>
  }
  else {
    joinButton = null;
  }

  // Determine Invite Button
  if (!props.invited && !props.isOver) {
    inviteButton = 
      <React.Fragment key="invite">
        <button onClick={props.toggleInvite} className="btn">Invite Players</button>
        {btnStyle}
      </React.Fragment>
  }
  else {
    inviteButton = null;
  }

  return (
    <PlayerList 
      players={data.players}
      spotsMessage={spotsMessage}
      spots={props.spots}
      joinGame={joinGame}
      joinButton={joinButton}
      inviteButton={inviteButton}
      playerFound={playerFound}
      subscribeToMore={() => {
        subscribeToMore({
          document: PLAYER_JOINED,
          variables: { gameId: props.gameId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data.playerJoined) return prev;
            return { players: prev.players.concat([subscriptionData.data.playerJoined]) }
          }
        });
        subscribeToMore({
          document: PLAYER_LEFT,
          variables: { gameId: props.gameId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data.playerLeft) return prev;
            return { players: prev.players.filter( val => {
              return val.userId !== subscriptionData.data.playerLeft.userId
            }) }
          }
        });
      }}
    />
  );
}

export default Players;