import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Router, { useRouter } from 'next/router';
import Loading from '../Loading/Loading';
import GameInfo from './GameInfo';
import PlayerList from './PlayerList';
import Discussion from './Discussion';
import gql from 'graphql-tag';
import CreateGameForm from '../CreateGame/CreateGameForm';
import Invite from './Invite';

const GET_GAME = gql`
  query Game($id: ID!, $gameId: ID!) {
    game(id: $id) {
        id
        title
        public
        dateTime
        endDateTime
        venue
        address
        sport
        description
        spots
        location {
          coordinates
        }
        conversationId
    }

    host(gameId: $gameId)
  }
  `;

const CANCEL_GAME = gql`
  mutation DeleteGame($gameId: ID!) {
    deleteGame(gameId: $gameId)
  }
  `;

function GameContainer(props) {

  const [editMode, setEditMode] = useState(false);
  const [inviteMode, setInviteMode] = useState(false);
  const [cancelMode, setCancelMode] = useState(false);
  
  const router = useRouter();
  const { invited } = router.query;

  const variables = {
    id: props.gameId,
    gameId: props.gameId
  }

  const { data, loading, error, refetch } = useQuery(GET_GAME, { variables: variables });
  const [cancelGame] = useMutation(CANCEL_GAME, { variables: { gameId: props.gameId } });
  if (loading) return <Loading></Loading>
  if (error) return <h4>ERROR!!!</h4>

  console.log(data)

  const d = new Date(parseInt(data.game.dateTime))
  const endD = new Date(parseInt(data.game.endDateTime))

  const time = (d.getHours() < 10 ? '0' + d.getHours().toString() : d.getHours().toString()) + ":" + (d.getMinutes() < 10 ? '0' + d.getMinutes().toString() : d.getMinutes().toString());
  const endTime = (endD.getHours() < 10 ? '0' + endD.getHours().toString() : endD.getHours().toString()) + ":" + (endD.getMinutes() < 10 ? '0' + endD.getMinutes().toString() : endD.getMinutes().toString());

  return (
    <React.Fragment>
    {(inviteMode || cancelMode) ? <div className="overlay"></div> : null}
    <div className="container">
      <div className="gameInfo">
        {editMode ? 
        <CreateGameForm 
          id={props.gameId}
          title={data.game.title}
          isPublic={data.game.public}
          date={d.getFullYear().toString() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()) + '-' +  (d.getDate() < 10 ? '0' + d.getDate().toString() : d.getDate().toString())}
          time={time}
          endDate={endD.getFullYear().toString() + '-' + ((endD.getMonth() + 1) < 10 ? '0' + (endD.getMonth() + 1).toString() : (endD.getMonth() + 1).toString()) + '-' +  (endD.getDate() < 10 ? '0' + endD.getDate().toString() : endD.getDate().toString())}
          endTime={endTime}
          sport={data.game.sport}
          spots={data.game.spots}
          venue={data.game.venue}
          address={data.game.address}
          coords={data.game.location.coordinates}
          description={data.game.description}
          exitFunc={() => setEditMode(false)}
          refetch={refetch}
        />
        :
        <GameInfo 
          game={data.game} 
          isHost={data.host === props.currentUser} 
          toggleEditing={() => setEditMode(true)} 
          toggleCancel={() => setCancelMode(!cancelMode)}
          cancelMode={cancelMode}
          cancelGame={() => {
            cancelGame()
            .then(response => {
              Router.push('/');
            })
          }}
        />
        }
      </div>

      {inviteMode ?
      <Invite 
        exit={() => setInviteMode(false)}
      />
      :
      null}
      
      <div className="players">
        <PlayerList 
          gameId={props.gameId}
          conversationId={data.game.conversationId} 
          spots={data.game.spots} 
          currentUser={props.currentUser} 
          isHost={data.host === props.currentUser} 
          toggleInvite={() => setInviteMode(true)}
          invited={invited}
        />
      </div>
      
      <div className="discussion">
        <Discussion conversationId={data.game.conversationId} currentUser={props.currentUser}/>
      </div>
    </div>

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
        animation-duration: .75s;
        animation-name: fadein;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0,0,0,0.5);
        z-index: 10;
        animation-duration: .75s;
        animation-name: fadein;
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

      @keyframes fadein {
        from {
            opacity: 0;
        } 
        
        to {
            opacity: 1;
        }
      }

    `}</style>
    </React.Fragment>
  );  
}

export default GameContainer;