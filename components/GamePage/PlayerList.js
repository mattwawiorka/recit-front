import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

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
    <div>  
      <h3 style={{textAlign: 'center', textDecoration: 'underline'}} >Host</h3>
      <h3>{props.host.name}</h3>
    </div>
    )
  } else {
    return <h3>No Host</h3>
  }
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

            const rows = [];
      
            data.players.forEach((player) => {
              rows.push(
                <React.Fragment key={player.id} >
                  <h3>{player.name}</h3>
                </React.Fragment>
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
                  {LeaveGame => <button onClick={LeaveGame}>Leave Game</button>}
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
                  {JoinGame => <button onClick={JoinGame}>Join Game</button>}
                </Mutation> 
            }

            return (
              <div className="container">
                <Host className="host" isHost={isHost} host={host} />
                <br />
                <div className="players">
                  <h3 style={{textAlign: 'center', textDecoration: 'underline'}}>Players</h3>
                  {rows}
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
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: var(--greenapple); /* Orange */
          color: white;
          max-width: 20vw;
          max-height: 40vh;
          height: 70%;
          width: 100%;
          border-radius: 25px;
          overflow: auto;
          margin: auto;
          margin-top: 2em;
          margin-bottom: 1em;
          padding: 1em;
          justify-items: center;
        }

        .host {
          flex: 1;
        }

        .players {
          flex: 4;
        }

        .button {
          flex: 1;
        }

        button {
          width: 100%;
          background-color: var(--darkermatter);
          color: white;
          padding: 14px 20px;
          margin 8px 0;
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