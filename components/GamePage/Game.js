import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import GameInfo from './GameInfo';
import PlayerList from './PlayerList';
import Discussion from './Discussion';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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

const GET_COMMENTS = gql`
  query Comments($gameId: ID!) {
    comments(gameId: $gameId) {
      id
      userName
      content
    }
  }
  `;

const CREATE_COMMENT = gql`
  mutation CreateComment($commentInput: commentInput) {
     createComment(commentInput: $commentInput) 
 }
 `;

const COMMENT_ADDED = gql`
 subscription {
   commentAdded {
     id
     userName
     content
   }
 }
`;

class Game extends Component {
  constructor(props) {
    // props
    super(props)
    // state
    this.state = {
        game: {},
        joined: false,
        date: "",
        time: "",
        loading: false,
        comment: ""
    };
  }

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  componentDidMount() {
    console.log('game mounted')
  }

  render() {
    const id = this.props.gameId;
    const gameId = this.props.gameId;
    console.log('game rendered')
        return (
          <React.Fragment>
          <div className="container">
            <div className="gameInfo">
            <Query query={GET_GAME} variables={{ id }}>
            {
              ({ loading, error, data }) => {
                if (loading) return <Loading></Loading>
                if (error) return <h4>ERROR!!!</h4>

                return <GameInfo game={data.game} />
              
              }
            }
            </Query>
            </div>
            
            <div className="players">
              <PlayerList gameId={gameId} />
            </div>
            
            <div className="discussion">
              <Discussion gameId={gameId} />
            </div>
          </div>

          <style jsx>{`
            .container {
              display: grid;
              //flex-wrap: wrap;
              max-width: 60vw;
              max-height: 82vh;
              //align-items: center;
              justify-items: center;
              grid-template-columns: 45vw 15vw;
              grid-template-rows: 45vh 37vh;
              grid-template-areas:
                "gameInfo players"
                "discussion discussion";
              //grid-gap: 10px;
              overflow: hidden;
            }

            .gameInfo {
              width: 100%;
              height: 100%;
              grid-area: gameInfo;
              overflow: hidden;
              // justify-content: space-around;
              // align-items: center;
              // alight-content: center;
              // justify-items: center;
              //padding: 10%;
              //margin-top: 2em;
            }

            .players {
              width: 100%;
              height: 100%;
              grid-area: players;
              overflow: hidden;
              //padding: 10%;
            }

            .discussion {
              width: 100%;
              height: 100%;
              grid-area: discussion;
              overflow: auto;
              //padding: 10%;
            }

            input[type=submit] {
              width: 50%;
              background-color: var(--darkermatter);
              color: white;
              padding: 14px 20px;
              margin 8px 0;
              border: none;
              border-radius: 4px;
              cursor: pointer;
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
            }

            input[type=submit]:hover {
                background-color: var(--darkmatter);
            }

          `}</style>
          </React.Fragment>
        );
      }
}

export default Game;