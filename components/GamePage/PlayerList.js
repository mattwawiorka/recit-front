import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
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
    joinGame(gameId: $gameId) 
  }
  `;

const LEAVE_GAME = gql`
  mutation LeaveGame($gameId: ID!) {
    leaveGame(gameId: $gameId) 
  }
  `;

const Host = (props) => {
  if (props.isHost) {
    return (
    <React.Fragment>
      <div className='host'>  
        <h3>Hosted by {props.host.name}</h3>
      </div>

      <style jsx>{`
        .host {
          display: inline-block;
          width: 100%;
        }

      `}</style>
    </React.Fragment>
    )
  } else {
    return <h3>No Host</h3>
  }
}

const Spots = (props) => {
  const { spots } = props;
  let result;
  console.log('spots', spots)
  console.log(props)
  if (spots === 0) {
    result = <h4>Game is full</h4>
  } 
  else if (spots === 1) {
    result = <h4>1 spot left</h4>
  }
  else {
    result = <h4>Open Spots: {spots}</h4>
  }

  return (
    <React.Fragment>
      {result}
    </React.Fragment>
  )
}

class PlayerList extends Component {
  constructor(props) {
    // props
    super(props)
    // state
    this.state = {
      
    };
  }

  render() {
    const gameId = this.props.gameId;
    const user = window.localStorage.getItem('user');
    return (
      <React.Fragment>
      
      <Query query={GET_PLAYERS} variables={{ gameId }}>
        {
          ({ loading, error, data }) => {
            if (loading) return <Loading></Loading>
            if (error) return <h4>ERROR!!!</h4>

            const openSpots = this.props.playerSpots - data.players.length;
          
            const rows = [];
            data.players.forEach((player) => {
              rows.push(
                <Link href={`/Profile?id=${player.id}`} as='/' key={player.id}>
                  <div className="player">
                    <h3>{player.name}</h3>
                  </div>
                </Link>
              );
            });

            let host = data.players.find(player => {
              return player.role === 1
            })

            let isHost = (host) ? true : false;

            let playerFound = data.players.some(player => {
              return player.id == user;
            });

            let button;

            if (playerFound) {
              button =  
                <Mutation 
                  mutation={LEAVE_GAME}
                  refetchQueries={() => {
                    console.log('refetch query', gameId)
                    return [{
                      query: GET_PLAYERS,
                      variables: {gameId: gameId}
                    }]
                  }}
                  variables={{ gameId }}
                >
                  {LeaveGame => {
                    return (                    
                      <button 
                        id="joinLeaveButton" 
                        onClick={LeaveGame}
                      >Leave Game</button>               
                    )
                  }}
                </Mutation> 
            } else {
              button =  
                <Mutation 
                  mutation={JOIN_GAME}
                  refetchQueries={() => {
                    console.log('refetch query', gameId)
                    return [{
                      query: GET_PLAYERS,
                      variables: {gameId: gameId}
                    }]
                  }}
                  variables={{ gameId }}
                >
                  {JoinGame => {
                    return (
                      <button id="joinLeaveButton" onClick={JoinGame}>Join Game</button>
                    )
                  }}
                </Mutation> 
            }

            return (
              <div className="container">
                <Host isHost={isHost} host={host} />
                <div className="players">
                  <h3 style={{ textDecoration: 'underline' }}>Players</h3>
                  {rows}
                </div>
                <div className="spots">
                  <Spots spots={openSpots} />
                </div>
                <div className="button">
                {button}
                </div>
              </div>
            );
          }
        }
      </Query>

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

        .player:hover {
          background-color: white;
          color: var(--greenapple);
          cursor: pointer;
          transform: scale(0.97);
          border-radius: 15px;
        }

        .spots {
          padding-top: 1em;
          text-align: center;
          margin-bottom: 1em;
          text-align: center;
        }

        .button {
          width: 100%;
          display: inline-block;
        }

        #joinLeaveButton {
          width: 100%;
          height: 85%;
          text-align: center;
          background-color: var(--darkermatter);
          color: white;
          padding: 7px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>

      </React.Fragment>
    );
  }
}

export default PlayerList;