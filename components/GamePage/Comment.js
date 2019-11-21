import React, { Component } from 'react';
import dateTool from '../../lib/dateTool';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            id
            user
        }
    }
`;

class Comment extends Component {

    handleDelete = (cb, e) => {
        e.preventDefault();
        cb();
    }

    render() {
        const { comment } = this.props;
        return (
            <React.Fragment key={comment.id}>
                <Mutation
                    mutation={DELETE_COMMENT}
                    variables={{ id: comment.id }}
                >{deleteComment => (

                <form id="editForm">
                    <div className="comment">
                        <div className="heading">
                            <div className="userName">
                                {comment.userName}
                            </div>
                            {this.props.currentUser ? <strong onClick={e => this.handleDelete(deleteComment,e)} id="editButton">...</strong> : null}  
                            <div className="dateTime">
                                {dateTool.getDateTime(parseInt(comment.dateTime))}
                            </div>
                        </div>
                        <div className="body">
                            {comment.content}
                        </div>
                    </div>
                </form> 
                )}
                </Mutation>

                <style jsx>{`
                    .comment {
                        display: block;
                        max-width: 100%;
                        height: auto;
                        margin-top: 1em;
                        background-color: white;
                        color: black;
                        border-radius: 5px;
                        border-bottom-style: groove;
                        padding: 0.5em;
                        white-space: pre-wrap;
                    }

                    .heading {
                        width: 100%;
                        display: inline-block;
                    }

                    .userName {
                        display: inline-block;
                        width: 80%;
                        font-weight: bold;
                    }

                    #editButton {
                        width: 20%;
                        text-align: center;
                        padding-left: 12%;
                        cursor: pointer;
                    }

                    .dateTime {
                        color: #616770;
                        font-size: 0.8em;
                    }

                    .body {
                        max-width: 100%;
                        word-wrap: break-word;
                        padding: 0.5em;
                    }
                `}</style>
            </React.Fragment>  
        );
    }
}

export default Comment;