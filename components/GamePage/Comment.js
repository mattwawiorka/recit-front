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
                        <div className="user-pic-round">
                            <Link href='/Profile/[user]' as={`/Profile/${comment.user}`}>
                                <img 
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQYAAADBCAMAAAAace62AAAAPFBMVEX+/v6wsLCtra3a2tr8/Pz19fWzs7P4+Pi9vb3Ly8vBwcHo6OjY2Njw8PDT09Py8vLj4+O4uLjGxsbPz88cCaLbAAAEw0lEQVR4nO2d2ZakIAxAFTdQy/X//3VUtNqa2hSTDqFzn3p5kXskhKAxigRBEARBEARB4EmRtW2bpdSXQUZR1YPO1Urcl2N3o76m36Ya+2XwO+bf8zLJqC/t17iZ+NHAgwud/IkZkvTvHGwqYtNSXyQ2Sf7ZwXpPDEGHie6IBCvCFNQXi0VbHpRgp0ZCfb04JF9iwpMIHeCqkZ65FVYPqqO+amhuR6PCo4iR+rph6VwkzB5K6iuHJHG0MHnow0mm3C3MHkJZOa9YCOd+cI0Ldw+aegQQ3C5amDwM1GO4TpFftTB5qKlHcZnzWdMrDxX1MC5SQ1iI45x3mGxhLHAPDxpIA+9pcXWt3NFTj8WdFGCV2FB8yw9A8XGFejTOQErgmzxc20s8kVOPx5Ee1ELMtBZVwd4MccxzizVAa1AcS7QptIVYNdRjcgAwddrgmEIZeA0cZwVgBnnXwG+tgNpbPmgw1KM6DUJo4JhBNRgaFLvqC0jx7UkDu8ceECIkxxiJcTPw22UWOBq4nXBjrJcMK7PXz6peauB2zi8aFkTDgmhYkBC5kOFo4La3gq89LRrY1Z8wLDA8ugKuzq8a2B3oItTgOFbhgI+sVg3UozoN+GHNDL8DmwLBAr+FIoo0ggZ2ERKnGMmuFImxq2CXSi+AVyP5VSJnwGcFv+VyBnp3xW5ftQL8gAO/QwoLbJBkV3K5A/aM7KKBYdJggUyoOb9cAniQyTUyzMBVJHmmThtwuQPDPHoHUBGKZwL5A8yiyXtKzIBUoZi/YzQDkEtyXiXuXE6iuAcGS9pf88DvcOI12aXKA8cC5Gsypx4WoVmIosJ5XoQyIywOnV2shSCi447RwYPKQ1gpH+nisyLUwD9reqY4l0ipOLQJsXG4F1rY3dCiqD42M5TS4UWFPWnzXYRSJdu643ES/ak53PQ/E/adcOfW9OqliumPQxfi8vCOLBl69R+xbqq/5GCluHX1OJQTg2mSKvjOqYIgCIIgCJdJ07RYmH6gvpZfJm2rLmlMqfs+t59jsJ9oyPNel2asu6oNW0lWJWb3YY6XWytLrk1dsXtp4DtF1ZT529G/EZKXTReOi6IzT58mOS4jN10A1bis1m4G9ip0zXr3mdXfvkxyWEXfcDXRlTAONhOaYcG+aN5+psfdRDzyipiZAXdgRaiBz9zAksBLRIMnwYowDLLM8ye2DiJ8f+ihQGn39CxCez0zOtz5sPPg8w0B3i/0k4jS0wjRXnjQy8WDn4/CoLyU/VmEh2klyhv63zx41xuNwoJ/D03Cdps/4cGrJnE098LiwaP7AaVh6lEP3iQQOB2/Dnvw5DkpyI9xOOFHEeJ3thHvUV40I6cLj3cPHoRJnB54Jz3Qp9XUU2KBfFpQrpU/kK+a1KvEBu2umz4+WoijpC83A+3t4EdkmCGNDggNz1wh/GaDDznDBuHWAuUbFI4QdoVCaZTqCtmswGmi7ApZRu3POjFDVp91edEWD7LGJx4tlzNU+yt/UkgLUSLp1ZyYZgXNg4M4bebdIerFLRpEg2gQDaJBNIgG0SAaRINoEA2iQTSIBtEgGkSDaBANokE0iAbRIBosomFBNCyIhgUyDZ5B9HpJnfiFp28rC4IgCIIgCELQ/AOcpFAvjfMo8wAAAABJRU5ErkJggg==" 
                                    className="user-pic"
                                />
                            </Link> 
                        </div>
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
                    <div
                        ref={commentInput}
                        className="input-fields"
                        contentEditable={editMode}                  
                        autoComplete="off"
                    >
                        {comment.content}
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