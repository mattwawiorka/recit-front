import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import CommentList from './CommentList';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

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

class Discussion extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
            comment: ""
        };
    }

    handleChange = (input) => (e) => {
        this.setState({ [input]: e.target.value });
    };

    render() {
        const gameId = this.props.gameId;
        return (
            <React.Fragment>
            <div className="container">
                <h3 className="title" style={{ textAlign: 'center', 
                fontWeight: 'bold', fontSize: '1.5em' }}
                >Discussion</h3>
                
                <div className="userInput">
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
                                <textarea
                                    id='commentBox'
                                    onChange={this.handleChange("comment")} 
                                    type="text" 
                                    className="comment-text"
                                    placeholder="Add a comment..."
                                    autoComplete="off"
                                />
                            </div>
                            <input className="post-button" type="submit" value="Post" />
                        </form>
                        )}
                    </Mutation>
                </div>

                <br />

                <div className="comments">
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
                </div>

            </div>

            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    width: 90%;
                    height: 90%;
                    margin: 1em;
                }

                .title {
                    flex: 2;
                    font-weight: bold;
                }

                .userInput {
                    flex: 3;
                    display: flex;
                }

                form {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }

                .form-group {
                    flex: 8;
                    width: 80%;
                }

                textarea {
                    width: 80%;
                    height: 80%;
                    border-radius: 4px;
                }

                .post-button {
                    flex: 2;
                    width: 50%;
                    height: 50%;
                    background-color: var(--darkermatter);
                    color: white;
                    padding: 14px 20px;
                    margin 8px 0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    text-align: center;
                }

                .comments {
                    flex: 8;
                    height: 100%;
                }
            `}</style>
            </React.Fragment>
        )
    }
}

export default Discussion;