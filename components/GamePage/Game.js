import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import GameInfo from './GameInfo';
import PlayerList from './PlayerList';
import CommentList from './CommentList';
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
          players: [],
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

            <Query query={GET_COMMENTS} variables={{ gameId }}>
            {
              ({ loading, error, data, subscribeToMore }) => {
                if (loading) return <Loading></Loading>
                if (error) return <h4>ERROR!!!</h4>

                const more = () => subscribeToMore({
                  document: COMMENT_ADDED,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newComment = subscriptionData.data.commentAdded;
                    console.log('new Comment', newComment)
                    const newComments = Object.assign({}, prev, {comments: [...prev.comments, newComment]});
                    console.log('new comments', newComments)
                    return newComments
                  }
                })

                return <CommentList comments={data.comments} subscribeToMore={more} />
      
              }
            }
            </Query>

            <br />

            <Mutation
                mutation={CREATE_COMMENT}
                variables={{ commentInput: {
                    gameId: gameId,
                    content: this.state.comment
                } }}
                >
                {CreateComment => (
                  <form onSubmit={e => {
                    e.preventDefault();
                    document.getElementById('commentBox').value='';
                    CreateComment();
                  }}>
                    <div className="form-group">
                      <input 
                          id='commentBox'
                          onChange={this.handleChange("comment")} 
                          type="text" 
                          className="text-fields"
                          placeholder="Add a comment"
                          autoComplete="off"
                      />
                    </div>
                  <input type="submit" value="Add Comment" />
                </form>
                )}
            </Mutation>

          </React.Fragment>
        );
      }
}

export default Game;