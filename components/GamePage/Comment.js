import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';
import dateTool from '../../lib/dateTool';
import gql from 'graphql-tag';
import Link from 'next/link';

const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            id
            user
        }
    }
`;

const UPDATE_COMMENT = gql`
    mutation UpdateComment($id: ID!, $content: String!) {
        updateComment(id: $id, content: $content) {
            id
            user
        }
    }
`;

function Comment(props) {
    const { comment, isOwner, refetch } = props;

    const [content, setContent] = useState(comment.content);
    const [showActions, setShowActions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showSave, setShowSave] = useState(false);

    const [updateComment] = useMutation(UPDATE_COMMENT, { variables: { id: comment.id, content: content } });
    const [deleteComment] = useMutation(DELETE_COMMENT, { variables: { id: comment.id } });

    const commentInput = useRef();

    useEffect(() => {
        refetch();
        if (commentInput.current) {
            commentInput.current.innerText = content;
            if (isOwner) {
                commentInput.current.addEventListener("input", e => {
                    setContent(e.target.innerText);
                    setShowSave(e.target.innerText !== comment.content)
                })
            } 
        } 
    }, [props])

    return (
        <React.Fragment key={comment.id}>
            <div className="comment">
                <div className="heading">
                    <div className="info">
                        <div className="userName">
                            <Link href='/Profile/[user]' as={`/Profile/${comment.user}`}>
                                <a>{comment.userName}</a>
                            </Link>
                        </div> 
                        <div className="dateTime">
                            {dateTool.getDateTime(parseInt(comment.dateTime))}
                        </div>
                    </div>

                    <div className="actions">
                        {isOwner ? 
                        <strong 
                            onClick={() => {
                                setShowActions(!showActions);
                                if (editMode) setEditMode(false);
                            }} 
                            className="toggle"
                        >...</strong> 
                        : 
                        null} 

                        {showActions ?
                        <div className="action-btns">
                            <button onClick={() => setEditMode(true)} className="btn">Edit</button>
                            <button onClick={deleteComment} className="btn">Delete</button>
                        </div>
                        :
                        null}
                    </div>
                </div>

                

                <div className="body">
                    {isOwner ? 
                    <>
                        <div
                            ref={commentInput}
                            className="input-fields"
                            contentEditable={editMode}                  
                            autoComplete="off"
                        >
                        </div>  
                        {showSave ? 
                            <button 
                                onClick={() => {
                                    updateComment();
                                    setShowSave(false); 
                                    setEditMode(false);
                                    setShowActions(false);
                                }} 
                                className="btn save-edit"
                            >Save</button> 
                        : null}
                    </>
                    : 
                    comment.content} 
                </div>
            </div>

            
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
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                .heading {
                    width: 100%;
                    display: inline-block;
                }

                .info {
                    display: inline-block;
                    width: 80%;
                }

                .userName {
                    display: block;
                    font-weight: bold;
                }

                .dateTime {
                    display: block;
                    color: #616770;
                    font-size: 0.8em;
                }

                .actions {
                    display: inline-block;
                    width: 20%;
                    height: 100%;
                    text-align: right;
                    vertical-align: top;
                }

                .toggle {
                    height: 100%;
                    vertical-align: top;
                    cursor: pointer;
                    margin-right: 1em;
                }

                .action-btns {
                    display: inline-block;
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                .btn {
                    margin-right: 1em;
                    margin-top: 0;
                    width: 4em;
                    height: 1.5em;
                    vertical-align: top;
                }

                .body {
                    max-width: 100%;
                    word-wrap: break-word;
                    padding: 0.5em;
                }

                .input-fields {
                    outline: none;
                }

                .save-edit {
                    display: inline-block;
                    width: 4em;
                    height: 1.5em;
                    margin-top: 1em;
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                    }
            `}</style>
        </React.Fragment>  
    );
}

export default Comment;