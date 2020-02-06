import React, { useRef, useState, useCallback } from "react";
import classNames from 'classnames';

function InputBox(props) {

    // const mentionPattern = /@[a-z]*\s/i;
    const invitePattern = /@invite+/i;

    const commentInput = useRef();
    const commentActions = useRef();

    const [content, setContent] = useState(null);
    const [showActions, setShowActions] = useState(false);
    const [invite, setInvite] = useState(false);

    const clearInput = useCallback( () => {
        setShowActions(false);
        if (commentInput.current) {
            commentInput.current.innerText = "";
        }
    });

    const textClass = classNames({
        "input-fields": true,
        "mention": invite
    });

    return (
        <React.Fragment> 
            <div className="new-comment">
                <div className="user-pic-round">
                    <img 
                        src={props.userPic}
                        className="user-pic"
                    />
                </div>
                
                <div
                    ref={commentInput}
                    className={textClass} 
                    contentEditable={true} 
                    placeholder="Add a comment..." 
                    onInput={e => {
                        if (invitePattern.test(e.target.innerText)) {
                            setInvite(true)
                        } else {
                            setInvite(false)
                        }
                        setContent(e.target.innerText);
                        setShowActions(e.target.innerText !== "");
                    }}
                    autoComplete="off"
                />
            
                {showActions ?
                <div className="actions" ref={commentActions}>
                    <button 
                        className="btn-post-comment"
                        onClick={() => {
                            if (content) {
                                if (invite) {
                                    props.invite({ variables:
                                        {
                                            conversationId: props.conversationId, 
                                            userId: parseInt(content.split("@invite")[1].trim()), 
                                            gameId: props.gameId
                                        }
                                    })
                                    .then(response => {
                                        console.log(response)
                                        if (response.errors) {
                                            console.log(response.errors)
                                        }
                                        clearInput();
                                    });
                                } else {
                                    props.createComment({ variables: 
                                        { messageInput: 
                                            {
                                                conversationId: props.conversationId,
                                                gameId: props.gameId,
                                                content: content.trim()
                                            } 
                                        }
                                    })
                                    .then(response => {
                                        if (response.errors) {
                                            console.log(response.errors)
                                        }
                                        clearInput();
                                    });
                                }  
                            }  
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