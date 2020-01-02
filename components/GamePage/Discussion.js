import gql from "graphql-tag";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from '@apollo/react-hooks';
import CommentList from './CommentList';
import Loading from '../Loading/Loading';


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

function Discussion(props) {

    const commentInput = useRef();
    const commentActions = useRef();

    const [content, setContent] = useState(null);
    const [showActions, setShowActions] = useState(false);

    useEffect(() => {
        console.log(content);
        if (commentInput.current) {
            commentInput.current.addEventListener("input", e => {
                setContent(e.target.innerText);
                setShowActions(e.target.innerText !== "");
            }) 
        } 
    }, [content]);

    const clearInput = useCallback( () => {
        setShowActions(false);
        commentInput.current.innerText = "";
        setContent("");
    });
    
    const { data, loading, error, refetch, subscribeToMore, fetchMore } = useQuery(GET_COMMENTS, { variables: { gameId: props.gameId } });
    const [createComment] = useMutation(CREATE_COMMENT, 
        { variables: 
            { commentInput: 
                {
                    gameId: props.gameId,
                    content: content
                } 
            }
        }
    );
    if (loading) return <Loading />
    if (error) return <h4>ERROR!!!</h4>

    const sortedComments = data.comments.sort( (a,b) => {
        let comparison;
        if (parseInt(b.dateTime) > parseInt(a.dateTime)) {
            comparison = 1;
        } else {
            comparison = -1;
        }
        return comparison;
    })

    return (
        <React.Fragment>
            <div className="discussion-container">
                <h3 className="title">Discussion</h3>
                <div className="new-comment">
                    <img 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQYAAADBCAMAAAAace62AAAAPFBMVEX+/v6wsLCtra3a2tr8/Pz19fWzs7P4+Pi9vb3Ly8vBwcHo6OjY2Njw8PDT09Py8vLj4+O4uLjGxsbPz88cCaLbAAAEw0lEQVR4nO2d2ZakIAxAFTdQy/X//3VUtNqa2hSTDqFzn3p5kXskhKAxigRBEARBEARB4EmRtW2bpdSXQUZR1YPO1Urcl2N3o76m36Ya+2XwO+bf8zLJqC/t17iZ+NHAgwud/IkZkvTvHGwqYtNSXyQ2Sf7ZwXpPDEGHie6IBCvCFNQXi0VbHpRgp0ZCfb04JF9iwpMIHeCqkZ65FVYPqqO+amhuR6PCo4iR+rph6VwkzB5K6iuHJHG0MHnow0mm3C3MHkJZOa9YCOd+cI0Ldw+aegQQ3C5amDwM1GO4TpFftTB5qKlHcZnzWdMrDxX1MC5SQ1iI45x3mGxhLHAPDxpIA+9pcXWt3NFTj8WdFGCV2FB8yw9A8XGFejTOQErgmzxc20s8kVOPx5Ee1ELMtBZVwd4MccxzizVAa1AcS7QptIVYNdRjcgAwddrgmEIZeA0cZwVgBnnXwG+tgNpbPmgw1KM6DUJo4JhBNRgaFLvqC0jx7UkDu8ceECIkxxiJcTPw22UWOBq4nXBjrJcMK7PXz6peauB2zi8aFkTDgmhYkBC5kOFo4La3gq89LRrY1Z8wLDA8ugKuzq8a2B3oItTgOFbhgI+sVg3UozoN+GHNDL8DmwLBAr+FIoo0ggZ2ERKnGMmuFImxq2CXSi+AVyP5VSJnwGcFv+VyBnp3xW5ftQL8gAO/QwoLbJBkV3K5A/aM7KKBYdJggUyoOb9cAniQyTUyzMBVJHmmThtwuQPDPHoHUBGKZwL5A8yiyXtKzIBUoZi/YzQDkEtyXiXuXE6iuAcGS9pf88DvcOI12aXKA8cC5Gsypx4WoVmIosJ5XoQyIywOnV2shSCi447RwYPKQ1gpH+nisyLUwD9reqY4l0ipOLQJsXG4F1rY3dCiqD42M5TS4UWFPWnzXYRSJdu643ES/ak53PQ/E/adcOfW9OqliumPQxfi8vCOLBl69R+xbqq/5GCluHX1OJQTg2mSKvjOqYIgCIIgCJdJ07RYmH6gvpZfJm2rLmlMqfs+t59jsJ9oyPNel2asu6oNW0lWJWb3YY6XWytLrk1dsXtp4DtF1ZT529G/EZKXTReOi6IzT58mOS4jN10A1bis1m4G9ip0zXr3mdXfvkxyWEXfcDXRlTAONhOaYcG+aN5+psfdRDzyipiZAXdgRaiBz9zAksBLRIMnwYowDLLM8ye2DiJ8f+ihQGn39CxCez0zOtz5sPPg8w0B3i/0k4jS0wjRXnjQy8WDn4/CoLyU/VmEh2klyhv63zx41xuNwoJ/D03Cdps/4cGrJnE098LiwaP7AaVh6lEP3iQQOB2/Dnvw5DkpyI9xOOFHEeJ3thHvUV40I6cLj3cPHoRJnB54Jz3Qp9XUU2KBfFpQrpU/kK+a1KvEBu2umz4+WoijpC83A+3t4EdkmCGNDggNz1wh/GaDDznDBuHWAuUbFI4QdoVCaZTqCtmswGmi7ApZRu3POjFDVp91edEWD7LGJx4tlzNU+yt/UkgLUSLp1ZyYZgXNg4M4bebdIerFLRpEg2gQDaJBNIgG0SAaRINoEA2iQTSIBtEgGkSDaBANokE0iAbRIBosomFBNCyIhgUyDZ5B9HpJnfiFp28rC4IgCIIgCELQ/AOcpFAvjfMo8wAAAABJRU5ErkJggg==" 
                        className="user"
                    />
                    
                    <div
                        ref={commentInput}
                        className="input-fields"  
                        contentEditable={true} 
                        placeholder="Add a comment..."
                        onClick={() => {
                            setShowActions(true);
                        }}        
                        autoComplete="off"
                    />
                
                    {showActions ?
                    <div className="actions" ref={commentActions}>
                        <button 
                            className="btn-post-comment"
                            onClick={() => {
                                if (content) {
                                    createComment()
                                    .then(response => {
                                        if (response.errors) {
                                            console.log(response.errors)
                                        }
                                        clearInput();
                                    });
                                }  
                            }}
                        >Post</button>
                    </div>
                    :
                    null}
                </div> 

                <CommentList 
                    comments={sortedComments} 
                    subscribeToMore={() => {
                        if (subscribeToMore) {
                            subscribeToMore({
                                document: COMMENT_ADDED,
                                updateQuery: (prev, { subscriptionData }) => {
                                    if (!subscriptionData.data) return prev;
                                    const newComment = subscriptionData.data.commentAdded;
                                    const newComments = Object.assign({}, prev, {comments: [...prev.comments, newComment]});
                                    return newComments
                                }
                            })
                        }
                    }} 
                    currentUser={props.currentUser} 
                    refetch={refetch} 
                    gameId={props.gameId} 
                />
            </div>

            <style jsx>{`
                .discussion-container {
                    display: block;
                    padding: 0% 10% 0% 10%;
                    margin-bottom: 4em;
                }

                .title {
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.5em;
                    margin-bottom: 0.5em;
                }

                .new-comment {
                    display: block;
                    padding-top: 0.5em;
                    background-color: white;
                    border-radius: 5px;
                    border-bottom-style: groove;
                }

                .user {
                    display: inline-block;
                    width: 8%;
                    border-radius: 50%;
                }

                .input-fields {
                    display: inline-block;
                    outline: none;
                    min-height: 4em;
                    width: 92%;
                    vertical-align: top;
                }

                .input-fields[placeholder]:empty:before {
                    content: attr(placeholder);
                    cursor: text;
                    color: #555; 
                }

                .actions {
                    width: 100%;
                    height: 3em;
                    padding: 0.3em 0.5em 0.3em 0.5em;
                    background-color: #E8E8E8;
                    border-top-style: groove;
                }

                .btn-post-comment {
                    width: 5em;
                    height: 2.4em;
                    float: right;
                }
            
            `}</style>
        </React.Fragment>
    );
}

export default Discussion;