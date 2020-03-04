import React, { useRef, useState, useCallback, useEffect } from "react";
import picTool from "../../lib/picTool";

function InputBox(props) {
    const debug = require('debug')('InputBox');

    const commentInput = useRef();
    const commentActions = useRef();

    const [content, setContent] = useState(null);
    const [replyHeading, setReplyHeading] = useState(null);
    const [showPost, setShowPost] = useState(false);

    const clearInput = useCallback( () => {
        setShowPost(false);
        setContent(null);
        setReplyHeading(null);
        if (commentInput.current) {
            commentInput.current.innerText = "";
        }
    });

    useEffect(() => {
        if (!props.reply.author) {
            return;
        } else {
            setReplyHeading("Replying to " + props.reply.author + "\n" + props.reply.content.substring(0, 50) + (props.reply.content.length > 50 ? "..." : ""));
        }
    }, [props.reply])

    return (
        <React.Fragment> 
            <div className="new-comment">
                <div className="user-pic-round">
                    <img 
                        src={picTool.getThumb(props.currentUser.profilePic)}
                        className="user-pic"
                    />
                </div>

                {replyHeading ?
                <span className="reply-header">
                    {replyHeading}
                </span>
                :
                null}
                
                <div
                    ref={commentInput}
                    className="input-fields"
                    contentEditable={true} 
                    placeholder="Add a comment..." 
                    onInput={e => {
                        setContent(e.target.innerText);
                        setShowPost(e.target.innerText.trim() !== "" && e.target.innerText.trim() !== "%REPLY%");
                    }}
                    autoComplete="off"
                />
            
                {showPost ?
                <div className="actions" ref={commentActions}>
                    <button 
                        className="btn-post-comment"
                        onClick={() => {
                            let messageInput;
                            if (replyHeading) {
                                messageInput = {
                                    conversationId: props.conversationId,
                                    gameId: props.gameId,
                                    content: replyHeading + '\n%REPLY%' + content.trim(),
                                    reply: true
                                }
                            }  else {
                                messageInput = {
                                    conversationId: props.conversationId,
                                    gameId: props.gameId,
                                    content: content.trim()
                                }
                            }
                            props.createComment({ variables: 
                                { messageInput: messageInput }
                            })
                            .then(response => {
                                if (response.errors) {
                                    debug(response);
                                }
                                clearInput();
                            });
                        }}
                    >Post</button>
                </div>
                :
                null}
            </div>

            <style jsx>{`
                .new-comment {
                    display: block;
                    min-height: 3em;
                    padding-top: 0.5em;
                    background-color: white;
                    border-radius: 5px;
                    border-bottom-style: groove;
                    white-space: pre-wrap;
                }

                .user-pic-round {
                    width: 3em;
                    height: 3em;
                    border-style: hidden;
                    border-radius: 50%;
                    border: 0;
                    overflow: hidden;
                    float: left;
                    margin: 0 0.5em;
                }

                .user-pic {
                    width: 100%;
                    height: 100%;
                }

                .input-fields {
                    display: block;
                    outline: none;
                    min-height: 3em;
                    // width: 90%;
                    vertical-align: top;
                    font-size: 1.2em;
                    overflow: hidden;
                    margin-left: 3.2em;
                }

                .reply-header {
                    color: #555;
                }

                .mention {
                    color: blue;
                }

                .input-fields[placeholder]:empty:before {
                    content: attr(placeholder);
                    cursor: text;
                    color: #555; 
                }

                .actions {
                    width: 100%;
                    height: 2.6em;
                    padding: 0.3em 0.5em 0.3em 0.5em;
                    background-color: #E8E8E8;
                    border-top-style: groove;
                    animation-duration: .75s;
                    animation-name: fadein;
                }

                .btn-post-comment {
                    width: 5em;
                    height: 2em;
                    float: right;
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

export default InputBox;