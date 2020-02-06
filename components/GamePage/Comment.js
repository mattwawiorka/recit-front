import React, { useState, useRef } from 'react';
import dateTool from '../../lib/dateTool';
import Link from 'next/link';
import classNames from 'classnames';

function Comment(props) {
    const { comment, isOwner, userPic } = props;

    const [content, setContent] = useState(props.comment.content);
    const [showActions, setShowActions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showSave, setShowSave] = useState(false);

    const commentInput = useRef();

    let bodyClass = classNames({
        'input-fields': true,
        'edit-mode': editMode,
        'invite-comment': comment.type === 3 || comment.type === 4
    });

    return (
        <React.Fragment key={comment.id}>
            <div className="comment">
                <div className="heading">
                    <div className="info">
                        <div className="user-pic-round">
                            <Link href='/Profile/[user]' as={`/Profile/${comment.userId}`}>
                                <img 
                                    src={userPic}
                                    className="user-pic"
                                />
                            </Link> 
                        </div>
                        <div className="userName">
                            <Link href='/Profile/[user]' as={`/Profile/${comment.userId}`}>
                                <a>{comment.author}</a>
                            </Link>
                        </div> 
                        <div className="dateTime">
                            {dateTool.getDateTime(parseInt(comment.updatedAt))}
                        </div>
                    </div>

                    <div className="actions">
                        {(isOwner && comment.type === 1) ? 
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
                            <button onClick={() => setEditMode(!editMode)} className="btn">Edit</button>
                            <button onClick={() => props.deleteComment({ variables: { id: comment.id } })} className="btn">Delete</button>
                        </div>
                        :
                        null}
                    </div>
                </div>

                <div className="body">
                    <div
                        ref={commentInput}
                        className={bodyClass}
                        contentEditable={editMode}
                        suppressContentEditableWarning={true}
                        onInput={e => {
                            setContent(e.target.innerText);
                            setShowSave(e.target.innerText !== comment.content && e.target.innerText !== "");
                        }}              
                        autoComplete="off"
                    >
                        {comment.content}
                    </div>  
                    {showSave ? 
                        <button 
                            onClick={() => {
                                props.updateComment({ variables: { id: comment.id, content: content } })
                                .then(response => {
                                    console.log(response)
                                })
                                setShowSave(false); 
                                setEditMode(false);
                                setShowActions(false);
                            }} 
                            className="btn save-edit"
                        >Save</button> 
                    : null}
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
                    display: inline-block;
                    width: 100%;
                    height: 3em;
                }

                .info {
                    display: inline-block;
                    float: left;
                    width: 65%;
                }

                .user-pic-round {
                    width: 3em;
                    height: 3em;
                    border-style: hidden;
                    border-radius: 50%;
                    border: 0;
                    overflow: hidden;
                    float: left;
                    margin-right: 0.5em;
                }

                .user-pic {
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }

                .userName {
                    height: 100%;
                    vertical-align: top;
                    font-weight: bold;
                }

                .dateTime {
                    color: #616770;
                    font-size: 0.8em;
                }

                .actions {
                    display: inline-block;
                    float: right;
                    width: 35%;
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
                    font-size: 1.2em;
                }

                .invite-comment {
                    font-style: italic;
                }

                .input-fields {
                    outline: none;
                }

                .edit-mode {
                    border: 1.5px solid var(--greenapple);
                    border-radius: 5px;
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