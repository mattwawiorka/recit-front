import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Loading from '../Loading/Loading';
import GameInfo from './GameInfo';
import Players from './Players';
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
      category
      sport
      image
      description
      spots
      spotsReserved
      players
      location {
        coordinates
      }
      conversationId
    }

    host(gameId: $gameId) {
      userId
      isMe
    }

    whoAmI {
      id
      name
      profilePic
    }
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

  const variables = {
    id: props.gameId,
    gameId: props.gameId
  }

  const { data, loading, error, refetch } = useQuery(GET_GAME, { variables: variables });
  const [cancelGame] = useMutation(CANCEL_GAME, { variables: { gameId: props.gameId } });
  if (loading) return <Loading />
  if (error) {
    props.redirect(true);
    return null;
  }

  const isOver = Date.now() > data.game.dateTime;

  const d = new Date(parseInt(data.game.dateTime))
  const endD = new Date(parseInt(data.game.endDateTime))

  const time = (d.getHours() < 10 ? '0' + d.getHours().toString() : d.getHours().toString()) + ":" + (d.getMinutes() < 10 ? '0' + d.getMinutes().toString() : d.getMinutes().toString());
  const endTime = (endD.getHours() < 10 ? '0' + endD.getHours().toString() : endD.getHours().toString()) + ":" + (endD.getMinutes() < 10 ? '0' + endD.getMinutes().toString() : endD.getMinutes().toString());

  return (
    <React.Fragment>
    {(inviteMode || cancelMode || editMode) ? <div className="overlay"></div> : null}

    {editMode ? 
    <CreateGameForm 
      id={props.gameId}
      title={data.game.title}
      isPublic={data.game.public}
      date={d.getFullYear().toString() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()) + '-' +  (d.getDate() < 10 ? '0' + d.getDate().toString() : d.getDate().toString())}
      time={time}
      endDate={endD.getFullYear().toString() + '-' + ((endD.getMonth() + 1) < 10 ? '0' + (endD.getMonth() + 1).toString() : (endD.getMonth() + 1).toString()) + '-' +  (endD.getDate() < 10 ? '0' + endD.getDate().toString() : endD.getDate().toString())}
      endTime={endTime}
      category={data.game.category}
      sport={data.game.sport}
      spots={data.game.spots}
      spotsReserved={data.game.spotsReserved}
      playersCount={data.game.players}
      venue={data.game.venue}
      address={data.game.address}
      coords={data.game.location.coordinates}
      description={data.game.description}
      exitFunc={() => setEditMode(false)}
      refetch={refetch}
    />
    :
    null 
    }

    <div className="game-container">
      <div className="info"> 
        <GameInfo 
          game={data.game} 
          isOver={isOver}
          isHost={data.host.isMe} 
          toggleEditing={() => setEditMode(true)} 
          toggleCancel={() => setCancelMode(!cancelMode)}
          cancelMode={cancelMode}
          cancelGame={() => {
            cancelGame()
            .then(response => {
              if (response.data.deleteGame) {
                props.redirect(false);
              }
            })
          }}
        />
      </div>

      <div className="players">
        <Players 
          gameId={props.gameId}
          isOver={isOver}
          conversationId={data.game.conversationId} 
          spots={data.game.spots} 
          isHost={data.host.isMe} 
          currentUser={data.whoAmI}
          toggleInvite={() => setInviteMode(true)}
        />
      </div>

      <div className="discussion">
        <Discussion 
          isOver={isOver}
          conversationId={data.game.conversationId} 
          gameId={props.gameId}
          currentUser={data.whoAmI}
        />
      </div>

      {inviteMode ?
      <Invite
        gameId={props.gameId}
        conversationId={data.game.conversationId}
        location={data.game.location.coordinates}
        exit={() => setInviteMode(false)}
      />
      :
      null}
    </div>

    <style jsx>{`
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

      .game-container {
        display: grid;
        grid-template-columns: 60% 40%;
        grid-template-rows: max-content;
        grid-template-areas:
            "info players"
            "discussion players";
        width: 100%;
        animation-duration: .75s;
        animation-name: fadein;
      }

      .info {
        grid-area: info;
        vertical-align: top;
        display: inline-block;
        height: auto;
        padding: 0 40px;
      }

      .discussion {
        grid-area: discussion;
        display: inline-block;
        padding: 1em 0;
      }

      .players {
        grid-area: players;
        padding-right: 100px;
      }

      .right-space {
        width: 200px;
        height: 0px;
        float: right;
      }

      @keyframes fadein {
        from {
            opacity: 0;
        } 
        
        to {
            opacity: 1;
        }
      }

      /******************
      *     Laptop      *
      *******************/
      @media only screen and (max-width: 1440px) {
        .players {
          padding-right: 10px;
        }
      }

      /******************
      *     Tablet      *
      *******************/
      @media only screen and (max-width: 850px) {
        .game-container {
          display: block;
        }

        .info, .players, .discussion {
          width: 100%;
          padding: 0 10px;
        }

        .players {
          padding: 0 10%;
        }

        .discussion {
          padding: 2.5em 0;
        }
      }

      /******************
      *     Mobile      *
      *******************/
      @media only screen and (max-width: 600px) {
        .players {
          padding: 0 3%;
        }
      }

    `}</style>
    </React.Fragment>
  );  
}

export default GameContainer;