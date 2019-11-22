import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import CommentList from './CommentList';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_COMMENTS = gql`
    query Comments($gameId: ID!) {
        comments(gameId: $gameId) {
            id
            user
            userName
            content
            dateTime
        }
    }
`;

const CREATE_COMMENT = gql`
    mutation CreateComment($commentInput: commentInput) {
        createComment(commentInput: $commentInput) {
            id
            user
        }
    }
`;

const COMMENT_ADDED = gql`
    subscription {
        commentAdded {
            id
            user
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
            commentBoxRows: 2
        };
    }

    handleChange = (input) => (e) => {
        this.setState({ 
            [input]: e.target.value
        });

        // Adjust size of post box based on input, and decide whether to show post button
        if (e.target.value !== "") {
            document.getElementById("postCommentButton").style.visibility = "visible";
            const rowHeight = 24;
            const currentRows = Math.ceil(e.target.scrollHeight / rowHeight);
            if (currentRows > 2) {
                this.setState({
                    commentBoxRows: currentRows
                })
            }
        } else {
            document.getElementById("postCommentButton").style.visibility = "hidden";
            this.setState({
                commentBoxRows: 2
            })
        }
    };

    componentDidMount() {
        // Make sure post button is originally hidden
        document.getElementById("postCommentButton").style.visibility = "hidden";
    }

    render() {
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
                            gameId: this.props.gameId,
                            content: this.state.comment
                        } }}
                        >
                        {CreateComment => (
                        <form 
                            id="commentForm" 
                            onSubmit={e => {
                                e.preventDefault();
                                document.getElementById('commentBox').value='';
                                CreateComment()
                                .then(response => {
                                    console.log(response)
                                    if (response.errors) {
                                        console.log(response.errors)
                                    }
                                    document.getElementById("postCommentButton").style.visibility = "hidden";
                                    this.setState({
                                        commentBoxRows: 2
                                    })
                                })
                        }}>
                            <textarea
                                id='commentBox'
                                onChange={this.handleChange("comment")} 
                                type="text" 
                                placeholder="Add a comment..."
                                rows={this.state.commentBoxRows}
                                autoComplete="off"
                            />
                            <input id="postCommentButton" className="post-button" type="submit" value="Post" />
                        </form>
                        )}
                    </Mutation>
                </div>

                <div className="comments">
                    <Query query={GET_COMMENTS} variables={{ gameId: this.props.gameId }}>
                    {
                    ({ loading, error, data, subscribeToMore, refetch }) => {
                        if (loading) return <Loading></Loading>
                        if (error) return <h4>ERROR!!!</h4>

                        const more = () => subscribeToMore({
                        document: COMMENT_ADDED,
                        updateQuery: (prev, { subscriptionData }) => {
                            if (!subscriptionData.data) return prev;
                            const newComment = subscriptionData.data.commentAdded;
                            const newComments = Object.assign({}, prev, {comments: [...prev.comments, newComment]});
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
                        
                        return <CommentList comments={sortedComments} subscribeToMore={more} currentUser={this.props.currentUser} refetch={refetch} gameId={this.props.gameId} />
                    }
                    }
                    </Query>

                </div>

            </div>

            <style jsx>{`
                .container {
                    display: block;
                    width: 90%;
                    height: 90%;
                    margin: auto;
                    margin-bottom: 5em;
                }

                .title {
                    font-weight: bold;
                }

                .userInput {
                    border-style: groove;
                    border-radius: 5px;
                    overflow: auto;
                }

                #commentForm {
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
                    width: 20%;
                    height: 40%;
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
                    height: 100%;
                }
            `}</style>
            </React.Fragment>
        )
    }
}

export default Discussion;