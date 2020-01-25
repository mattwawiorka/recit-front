import React, { useEffect } from 'react';
import Link from 'next/link';

function PlayerList(props) {
  let host, i;

  useEffect(() => {
      props.subscribeToMore();
  }, [])

  const playerStyle = 
    <style jsx="true">{`
      .player {
        display: block;
        width: 100%;
        height: 3em;
        margin-bottom: 0.5em;
        overflow: hidden;
      }

      .player-pic {
        display: inline-block;
        float: left;
        width: 30%;
        height: 100%;
      }

      .player-pic-round {
        width: 3em;
        height: 3em;
        border-style: hidden;
        border-radius: 50%;
        border: 0;
      }

      .open-spot {
        // transform(-50%, 0%);
        margin: auto;
        background-color: var(--greyapple);
        font-style: italic;
      }

      .player-name-container {
        display: inline-block;
        height: 3em;
        width: 70%;
        text-align: left;
      }

      .player-name {
        display: inline-block;
        margin-left: 0.25em;
        vertical-align: -50%;
        transform(0%, -50%);
        font-size: 1.2em;
      }

      .player:hover {
        cursor: pointer;
        transform: scale(0.95);
        border-radius: 15px;
      }
    `}</style>

  const players = [];
  for (i = 0; i < props.spots; i++) {
    let player = props.players[i];

    if (player && player.role === 1) {
      host = player;
    }

    if (player) {
      players.push(
        <React.Fragment key={i}>
          <Link href='/Profile/[user]' as={`/Profile/${player.userId}`}>
            <div className="player">
              <span className="player-pic">
                <img 
                  src={'http://localhost:8080/images/' + player.profilePic} 
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
    } else {
      players.push(
        <React.Fragment key={i}>
          <div className="player" onClick={() => { if (!props.playerFound) props.joinGame() }}>
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
    
  }

  return (
    <React.Fragment>
      <div className="players-container">
        <div className="host">  
          <h3>{host ? "Hosted by " + host.name : null}</h3>
        </div>

        <div className="players">
          {/* <h3 style={{ textDecoration: 'underline' }}>Players</h3> */}
          {players}
        </div>

        <div className="spots">
          {props.spotsMessage}
        </div>

        <div className="buttons">
          {props.joinButton}
          {props.inviteButton}
        </div>
      </div>

      <style jsx>{`
        .players-container {
          display: block;
          align-items: center;
          background-color: var(--greenapple); 
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

        .spots {
          padding-top: 1em;
          text-align: center;
          margin-bottom: 1em;
          text-align: center;
          font-size: 1em;
          font-style: italic;
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