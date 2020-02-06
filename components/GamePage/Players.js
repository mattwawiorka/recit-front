import { useQuery, useMutation } from '@apollo/react-hooks';
import Loading from '../Loading/Loading';
import gql from 'graphql-tag';
import PlayerList from './PlayerList';

const GET_PARTICIPANTS = gql`
  query Participants($gameId: ID!, $conversationId: ID!) {
    players(gameId: $gameId) {
      userId
      name
      level
      profilePic
      isMe
    }

    watchers(conversationId: $conversationId) {
      userId
      name
      level
      profilePic
      isMe
    }

    whoAmI {
      id
    }
  }
`;

const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!, $conversationId: ID!) {
    joinGame(gameId: $gameId, conversationId: $conversationId) {
      userId
      name
      level
      profilePic
      isMe
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

const SUBSCRIBE = gql`
  mutation SubscribeToGame($gameId: ID!, $conversationId: ID!) {
    subscribe(gameId: $gameId, conversationId: $conversationId) {
      userId
      name
      level
      profilePic
      isMe
    }
  }
`;

const UNSUBSCRIBE = gql`
  mutation UnsubscribeToGame($gameId: ID!, $conversationId: ID!) {
    unsubscribe(gameId: $gameId, conversationId: $conversationId) {
      userId
      name
      level
      profilePic
      isMe
    }
  }
`;

const NEW_PARTICIPANT = gql`
  subscription ParticipantJoined($gameId: ID!) {
    participantJoined(gameId: $gameId) {
      userId
      name
      level
      profilePic
      isMe
      invited
      player
      wasInterested
    }
  }
`;

const PARTICIPANT_LEFT = gql`
  subscription ParticipantLeft($gameId: ID!) {
    participantLeft(gameId: $gameId) {
      userId
      player
    }
  }
`;

function Players(props) {

  let variables = { 
    gameId: props.gameId,
    conversationId: props.conversationId
  }

  const { data, loading, error, subscribeToMore } = useQuery(GET_PARTICIPANTS, { variables: variables }); 
  const [joinGame] = useMutation(JOIN_GAME, { variables: variables });
  const [leaveGame] = useMutation(LEAVE_GAME, { variables: variables });
  const [subscribe] = useMutation(SUBSCRIBE, { variables: variables });
  const [unsubscribe] = useMutation(UNSUBSCRIBE, { variables: variables });
  if (loading) return <Loading />
  if (error) {
    console.log(error)
    return <h4>ERROR!!!</h4>
  }

  let joined = data.players.some(p => {
    return p.userId == data.whoAmI.id;
  });

  let invited = data.watchers.some(w => {
    return ((w.userId == data.whoAmI.id) && w.level == 3);
  });

  let interested = data.watchers.some(w => {
    return ((w.userId == data.whoAmI.id) && w.level == 2);
  });

  let reservedSpotFound = data.players.some(p => {
    return !p.userId;
  });

  return (
    <PlayerList 
      players={data.players}
      watchers={data.watchers}
      spots={props.spots}
      isOver={props.isOver}
      isHost={props.isHost}
      joined={joined}
      reservedSpotFound={reservedSpotFound}
      invited={invited}
      interested={interested}
      joinGame={joinGame}
      leaveGame={leaveGame}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
      toggleInvite={props.toggleInvite}
      subscribeToMore={() => {
        subscribeToMore({
          document: NEW_PARTICIPANT,
          variables: { gameId: props.gameId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data.participantJoined) return prev;
            else if (subscriptionData.data.participantJoined.player) {
              let players, watchers;
              if (subscriptionData.data.participantJoined.invited) {
                let i = prev.players.findIndex(p => { return !p.userId })
                players = prev.players;
                players[i] = subscriptionData.data.participantJoined;
              } else {
                players = prev.players.concat([subscriptionData.data.participantJoined])
              }
              if (subscriptionData.data.participantJoined.wasInterested) {
                watchers = prev.watchers.filter( val => {
                  return val.userId !== subscriptionData.data.participantJoined.userId
                });
              } else {
                watchers = prev.watchers
              }
              return {
                players: players,
                whoAmI: prev.whoAmI,
                watchers: watchers
              }
            }
            else {
              let watchers = prev.watchers.concat([subscriptionData.data.participantJoined]);
              return {
                players: prev.players,
                whoAmI: prev.whoAmI,
                watchers: watchers
              }
            }
          }
        });
        subscribeToMore({
          document: PARTICIPANT_LEFT,
          variables: { gameId: props.gameId },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data.participantLeft) return prev;
            else if (subscriptionData.data.participantLeft.player) {
              let players;
              players = prev.players.filter( val => {
                return val.userId !== subscriptionData.data.participantLeft.userId
              });
              return {
                players: players,
                whoAmI: prev.whoAmI,
                watchers: prev.watchers
              }
            }
            else {
              let watchers;
              watchers = prev.watchers.filter( val => {
                return val.userId !== subscriptionData.data.participantLeft.userId
              });
              return {
                players: prev.players,
                whoAmI: prev.whoAmI,
                watchers: watchers
              }
            }
          }
        });
      }}
    />
  );
}

export default Players;