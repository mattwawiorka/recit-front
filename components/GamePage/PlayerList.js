import React, { useEffect } from 'react';
import Link from 'next/link';

function PlayerList(props) {
    let host;

    useEffect(() => {
        props.subscribeToMore();
    }, [])

    const players = [];
    props.players.map((player) => {
      if (player.role === 1) {
        host = player;
      }

      players.push(
        <React.Fragment key={player.userId}>
          <Link href='/Profile/[user]' as={`/Profile/${player.userId}`}>
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

    return (
        <React.Fragment>
            <div className="players-container">
                <div className='host'>  
                    <h3>{host ? "Hosted by " + host.name : null}</h3>
                </div>

                <div className="players">
                    <h3 style={{ textDecoration: 'underline' }}>Players</h3>
                    {players}
                </div>

                <div className="spots">
                    {props.spots}
                </div>

                <div className="button">
                    {props.joinButton}
                    {props.inviteButton}
                </div>
            </div>

            <style jsx>{`
                .players-container {
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