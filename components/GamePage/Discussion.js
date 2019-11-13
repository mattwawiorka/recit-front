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
      dateTime
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
     dateTime
   }
 }
`;

class Discussion extends Component {
    constructor(props) {
        // props
        super(props)
        // state
        this.state = {
            comment: "",
            showPostButton: false
        };
    }

    handleChange = (input) => (e) => {
        this.setState({ 
            [input]: e.target.value,
            showPostButton: true 
        });

        if (e.target.value !== "") {
            document.getElementById("postCommentButton").style.visibility = "visible";
        } else {
            document.getElementById("postCommentButton").style.visibility = "hidden";
        }
    };

    componentDidMount() {
        document.getElementById("postCommentButton").style.visibility = "hidden";
    }

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
                        <form 
                            className="commentForm" 
                            onSubmit={e => {
                            e.preventDefault();
                            document.getElementById('commentBox').value='';
                            CreateComment();
                        }}>
                            <textarea
                                id='commentBox'
                                onChange={this.handleChange("comment")} 
                                type="text" 
                                className="comment-text"
                                placeholder="Add a comment..."
                                autoComplete="off"
                            />
                            <input id="postCommentButton" className="post-button" type="submit" value="Post" />
                        </form>
                        )}
                    </Mutation>
                </div>

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

                        const sortedComments = data.comments.sort( (a,b) => {
                            let comparison;
                            if (parseInt(b.dateTime) > parseInt(a.dateTime)) {
                                comparison = 1;
                            } else {
                                comparison = -1;
                            }
                            return comparison;
                        })

                        return <CommentList comments={sortedComments} subscribeToMore={more} />
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
                    margin: auto;
                }

                .title {
                    flex: 1;
                    font-weight: bold;
                }

                .userInput {
                    flex: 3;
                    display: flex;
                    border-style: groove;
                    border-radius: 5px;
                    overflow: auto;
                }

                .commentForm {
                    display: flex;
                    width: 100%;
                    background-color: white;
                    border-radius: 5px;
                }

                textarea {
                    width: 80%;
                    height: 100%;
                    border: none;
                    resize: none;
                    outline: none;
                    border-radius: 5px;
                    padding: 0.5em;
                    white-space: pre-wrap;
                }

                textarea::-webkit-input-placeholder {
                    color: #616770;
                }

                textarea:focus::-webkit-input-placeholder {
                    color: #A9A9A9;
                }

                .post-button {
                    //flex: 2;
                    width: 20%;
                    height: 30%;
                    background-color: var(--darkermatter);
                    color: white;
                    margin-top: auto;
                    margin-bottom: 0.5em;
                    margin-right: 0.5em;
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