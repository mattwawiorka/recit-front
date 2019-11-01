import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import GameInfo from './GameInfo';
import PlayerList from './PlayerList';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_GAME = gql`
  query Game($id: ID!) {
    game(id: $id) {
        id
        title
        dateTime
        endDateTime
        venue
        address
        sport
        description
    }
  }
  `;

const GET_PLAYERS = gql`
  query Players($gameId: ID!) {
    players(gameId: $gameId) {
      id
      name
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

class Game extends Component {
  constructor(props) {
      // props
      super(props)
      // state
      this.state = {
          game: {},
          players: [],
          date: "",
          time: "",
          loading: false
      };
    }

  componentDidMount() {
    console.log('Game Mounted')
  }

  render() {
    const id = this.props.gameId;
    const gameId = this.props.gameId;
        return (
          <React.Fragment>
            <Query query={GET_GAME} variables={{ id }}>
            {
              ({ loading, error, data }) => {
                if (loading) return <Loading></Loading>
                if (error) return <h4>ERROR!!!</h4>

                return <GameInfo game={data.game} />
              
              }
            }
            </Query>
          
            <Query query={GET_PLAYERS} variables={{ gameId }}>
            {
              ({ loading, error, data }) => {
                if (loading) return <Loading></Loading>
                if (error) return <h4>ERROR!!!</h4>

                return <PlayerList players={data.players} />
      
              }
            }
            </Query>

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

          </React.Fragment>
        );
      }
}

export default Game;