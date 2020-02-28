import React, { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import Link from 'next/link';

function PlayerList(props) {
  let i, j;

  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState(null);
  const [players, setPlayers] = useState([]);
  const [spotsMessage, setSpotsMessage] = useState(null);
  const [interestedMessage, setInterestedMessage] = useState(null);
  const [joinButton, setJoinButton] = useState(null);
  const [interestButton, setInterestButton] = useState(null);
  const [inviteButton, setInviteButton] = useState(null);
  const [showRest, setShowRest] = useState(false);

  const btnStyle = 
    <style jsx="true">{`
      .btn {
        width: 55%;
        // width: 7em;
        height: 32px;
        margin-top: 1em;
      }

      .btn-opposite {
        background-color: var(--greyapple);
        color: var(--darkermatter);
      }

      .btn-opposite:hover {
        background-color: var(--greyapple);
        color: var(--darkmatter);
      }

      /******************
      *     Tablet      *
      *******************/
      @media only screen and (max-width: 850px) {
        .btn {
          width: 80%;
          height: 50px;
        }
      }
    `}</style>

  const playerStyle = 
    <style jsx="true">{`
      .player {
        display: inline-block;
        width: 50%;
        height: 48px;
        margin-bottom: 8px;
        overflow: hidden;
      }

      .player-pic {
        display: inline-block;
        float: left;
        width: 30%;
        height: 100%;
      }

      .player-pic-round {
        width: 48px;
        height: 48px;
        border-style: hidden;
        border-radius: 50%;
        border: 0;
      }

      .open-spot {
        margin: auto;
        background-color: var(--greyapple);
      }

      .player-name-container {
        display: inline-block;
        height: 48px;
        width: 70%;
        padding-left: 5%;
        text-align: left;
      }

      .player-name {
        display: inline-block;
        vertical-align: -50%;
        transform(0%, -50%);
        font-size: 1.2em;
      }

      .player:hover {
        cursor: pointer;
        transform: scale(0.95);
      }

      /******************
      *     Mobile      *
      *******************/
      @media only screen and (max-width: 600px) {
        .player-name {
          font-size: 1em;
        }
      }
    `}</style>


  useEffect(() => {
    props.subscribeToMore();
  }, [])

  useEffect(() => {
    const openSpots = Math.max(props.spots - props.players.length, 0);
    let playersDisplay = [];

    // Determine Players
    for (i = 0; i < props.spots; i++) {
      let player = props.players[i];

      if (player && player.level === 1) {
        setHost(player.name);
      }

      if (player && player.level != 3) {
        playersDisplay.push(
          <React.Fragment key={i}>
            <Link href='/Profile/[user]' as={`/Profile/${player.userId}`}>
              <div className="player">
                <span className="player-pic">
                  <img 
                    src={player.profilePic.includes(process.env.API_URI) ? 
                          player.profilePic.split('.')[0] + '_THUMB.' + player.profilePic.split('.')[1] : 
                          player.profilePic} 
                    className="player-pic-round"
                  />
                </span>
                
                <span className="player-name-container">
                  <h3 className="player-name">{player.name}</h3>
                </span>
              </div>
            </Link>
            {playerStyle}
          </React.Fragment>
        );
      } 
      else if (player && player.level == 3) {
        playersDisplay.push(
          <React.Fragment key={i}>
            <div className="player" onClick={() => { if (!props.joined && props.invited) props.joinGame() }}>
              <span className="player-pic">
                <img 
                  src={player.profilePic} 
                  className="player-pic-round"
                />
              </span>
              
              <span className="player-name-container">
                <h3 className="player-name" style={{ fontStyle: "italic", fontSize: "0.9em" }}>Reserved Spot</h3>
              </span>
            </div>
            {playerStyle}
          </React.Fragment>
        );
      }
      else {
        playersDisplay.push(
          <React.Fragment key={i}>
            <div className="player" onClick={() => { if (!props.joined) props.joinGame() }}>
              <span className="player-pic">
                <div 
                  className="player-pic-round open-spot"
                />
              </span>
              
              <span className="player-name-container">
                <h3 className="player-name" style={{ fontStyle: "italic", fontSize: "0.9em" }}>Open Spot</h3>
              </span>
            </div>
            {playerStyle}
          </React.Fragment>
        );
      }

      if (i == props.spots - 1) {
        setPlayers(playersDisplay)
        setLoading(false)
      }
    }

    // Spots message
    if (props.isOver) {
      setSpotsMessage(null)
    }
    else if (openSpots === 0) {
      setSpotsMessage(<h4>No Spots Left</h4>)
    } 
    else if (openSpots === 1) {
      setSpotsMessage(<h4>1 Spot Left</h4>)
    }
    else {
      setSpotsMessage(<h4>Open Spots: {openSpots}</h4>)
    }

    // Watchers message
    let numberInterested = 0;
    for (j = 0; j < props.watchers.length; j++) {
      if (props.watchers[j].level == 2) numberInterested++
    }
    if (numberInterested=== 0) {
      setInterestedMessage(null)
    }
    else {
      setInterestedMessage(<h4>{numberInterested + " Interested"}</h4>)
    }

    // Determine Join Button
    if (props.isOver) {
      setJoinButton(null);
    }
    else if (props.joined && !props.isHost) {
      setJoinButton(
        <React.Fragment key="leave"> 
          <button 
            onClick={() => {
              props.leaveGame()
              .then(response => {
                // refetch();
              }) 
            }} 
            className="btn"
          >Leave Game</button>
          {btnStyle}
        </React.Fragment>
      );
    } 
    else if (!props.joined && openSpots > 0) {
      setJoinButton(
        <React.Fragment key="join"> 
          <button 
            onClick={() => {
              props.joinGame();
            }} 
            className="btn"
          >Join Game</button>
          {btnStyle}
        </React.Fragment>
      );
    }
    else if (props.reservedSpotFound && props.invited) {
      setJoinButton(
        <React.Fragment key="join"> 
          <button 
            onClick={() => {
              props.joinGame();
            }} 
            className="btn"
          >Join Game</button>
          {btnStyle}
        </React.Fragment>
      );
    }

    // Determine Interest Button
    if (props.isOver) {
      setInterestButton(null);
    }
    else if (!props.joined && !props.isHost && !props.interested) {
      setInterestButton(
        <React.Fragment key="subscribe"> 
          <button 
            onClick={() => {
              props.subscribe();
            }} 
            className="btn"
          >Interested</button>
          {btnStyle}
        </React.Fragment>
      );
    } 
    else if (props.interested) {
      setInterestButton(
        <React.Fragment key="unsubscribe"> 
          <button 
            onClick={() => {
              props.unsubscribe();
            }} 
            className="btn btn-opposite"
          >Not Interested</button>
          {btnStyle}
        </React.Fragment>
      );
    }
    else {
      setInterestButton(null)
    }

    // Determine Invite Button
    if (!props.isOver) {
      setInviteButton(
          <React.Fragment key="invite">
            <button onClick={props.toggleInvite} className="btn">Invite Players</button>
            {btnStyle}
          </React.Fragment>
      );
    }
  }, [props.players, props.watchers])

  if (loading) return <Loading />

  return (
    <React.Fragment>
      <div className="players-container">
        <div className="host">  
          <h3>{host ? "Hosted by " + host : null}</h3>
        </div>

        <div className="players">
          {players.length <= 16 ?
          players
          :
          <React.Fragment>
            {players.slice(0,16)}
            {showRest ?
            players.slice(16, 33) 
            :
            null
            }
            <button className="show-more" onClick={() => setShowRest(!showRest)}>{showRest ? "Show Less" : "Show More"}</button>
          </React.Fragment>
          }
        </div>

        <div className="spots">
          {spotsMessage}
        </div>

        <div className="interested">
          {interestedMessage}
        </div>

        <div className="buttons">
          {joinButton}
          {interestButton}
          {inviteButton}
        </div>
      </div>

      <style jsx>{`
        .players-container {
          display: block;
          align-items: center;
          background-color: var(--greenapple); 
          color: white;
          width: 100%;
          height: auto;
          // height: 85%;
          border-radius: 15px;
          margin: auto;
          margin-top: 2em;
          padding: 10px;
          justify-items: center;
          // overflow: auto;
          border-bottom-style: groove;
        }

        .host {
          font-style: italic;
        }

        .players {
          padding-top: 1.5em;
          text-align: center;
          margin-bottom: 1.5em;
        }

        .show-more {
          cursor: pointer;
          background: none;
          color: var(--darkermatter);
        }

        .spots {
          padding-top: 1em;
          text-align: center;
          margin-bottom: 1em;
          text-align: center;
          font-size: 1em;
          font-style: italic;
        }

        .interested {
          text-align: center;
        }

        .buttons {
          display: inline-block;
          width: 100%;
          text-align: center;
        }

        
      `}</style>
    </React.Fragment>
  );
}

export default PlayerList;