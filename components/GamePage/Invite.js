import { useRouter } from 'next/router';
import React, { useRef, useState, useCallback } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from 'react-apollo';

const FIND_PLAYER = gql`
    query FindPlayer($name: String!, $location: [Float], $cursor: String) {
        findUser(name: $name, location: $location, cursor: $cursor) {
            edges {
                node {
                    id
                    name
                    number
                }
                cursor
            }
            pageInfo {     
                endCursor
                hasNextPage
            }
        }
    }
`;

const INVITE = gql`
    mutation Invite($conversationId: ID!, $userId: ID!, $gameId: ID!) {
        addToConversation(conversationId: $conversationId, userId: $userId, gameId: $gameId)
    }
`;

function Invite(props) {

    let searchResults = [];

    const router = useRouter();

    const URL = "https://localhost:3000" + router.asPath;

    const [searchValue, setSearchValue] = useState("");
    const [players, setPlayers] = useState([]);
    
    const link = useRef(null);

    const [findPlayer, { called, data }] = useLazyQuery(FIND_PLAYER);
    const [invite] = useMutation(INVITE);

    if (data && data.findUser) {
        if (searchValue === "") {
            searchResults = null;
        } else {
            console.log('in here')
            searchResults = data.findUser.edges.map( (user, index) => {
                if (players.filter(p => p.id === user.node.id).length > 0) return
                return (
                    <React.Fragment key={user.node.id}>
                        <div 
                            className="search-result"
                            onClick={() => {
                                setPlayers([...players, { id: user.node.id, name: user.node.name }]);
                                setSearchValue("");
                            }}
                        >
                            {user.node.name}
                            <span className="jersey-number">{"#" + user.node.number}</span>
                        </div>

                        <style jsx>{`
                            .search-result {
                                background-color: white;
                                color: black;
                                font-size: 1.2em;
                                height: 35px;
                                cursor: pointer;
                            }

                            .jersey-number {
                                color: grey;
                                font-size: 0.65em;
                                margin-left: 1em;
                                font-family: 'Bitter', serif;
                            }

                            .search-result:hover {
                                color: var(--greenapple);
                            }

                            /******************
                            *  Laptop/tablet  *
                            *******************/
                            @media only screen and (max-width: 1024px) {
                                .search-result {
                                    font-size: 1.4em;
                                    height: 45px;
                                }
                            }

                            /******************
                            *     Mobile      *
                            *******************/
                            @media only screen and (max-width: 600px) {
                                .invite-container {

                                }
                            }
                        `}</style>
                    </React.Fragment>
                );
            })
        }
    }

    console.log(searchResults)

    const copyText = useCallback((e) => {
        link.current.select();
        document.execCommand('copy');
        e.target.focus();
    }, [])

    return (
        <React.Fragment>
            <div className="invite-container">

                <button 
                    onClick={props.exit} 
                    className="exit-btn" 
                    type="button"
                >X</button>

                <section className="player-select">
                    <div className="player-search">
                        <input 
                            type="text" 
                            className="search-bar input-fields"
                            value={searchValue}
                            onChange={ e => {
                                setSearchValue(e.target.value);
                                if (e.target.value != "") {
                                    findPlayer({ variables: { name: e.target.value,  location: props.location } });
                                } 
                            }}
                            placeholder="Search by Name" 
                        />

                        <div className="search-results">
                            {data ?
                            searchResults
                            : null}
                        </div>

                        {data && data.findUser.pageInfo.hasNextPage && searchValue != "" ?
                        <button 
                            className="btn-load-more"
                            onClick={() => findPlayer({ variables: { name: searchValue,  location: props.location, cursor: data.findUser.pageInfo.endCursor } })}
                        >Load More</button>
                        :
                        null}
                    </div>

                    <div className="players-selected">
                        <h3>Players Selected</h3>
                        <div className="selected-list">
                            { players.map(p => 
                                <div 
                                    className="selected-player"
                                    key={p.id}
                                    onClick={() => setPlayers(players.filter(val =>  val.id != p.id)) }
                                >
                                    {p.name}
                                </div>
                            )}
                        </div>
                        {players.length > 0 ?
                        <button
                            className="btn-send-invites"
                            onClick={() => {
                                Promise.all(players.map(p => {
                                    invite({ variables: {
                                        conversationId: props.conversationId, 
                                        userId: p.id, 
                                        gameId: props.gameId
                                    }})
                                }))
                                .then(() => props.exit())
                            }}
                        >
                            Send Invites!
                        </button>
                        :
                        null}
                    </div>  
                </section>
                
                <section className="link-invite">
                    <h3>Shareable Link</h3>
                    <input 
                        type="text"
                        ref={link} 
                        readOnly
                        value={URL}
                    />
                    <button onClick={(e) => copyText(e)}>Copy</button>
                </section>
                
            </div>

            <style jsx>{`
                .invite-container {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    top: 35%;
                    left: 50%;
                    z-index: 11;
                    display: block;
                    min-height: 400px;
                    max-height: 800px;
                    width: 550px;
                    color: white;
                    background-color: var(--greenapple);
                    border-radius: 10px;
                    padding: 10px;
                    animation-duration: 1.5s;
                    animation-name: fadein;
                    overflow: auto;
                }

                section {
                    display: block
                    width: 100%;
                }

                .player-select {
                    min-height: 350px;
                    padding-top: 20px;
                }

                .exit-btn {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    background: none;
                    border: none;
                    text-align: center;
                    outline: none;
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #4b4f56;
                    color: var(--darkermatter);
                    cursor: pointer;
                    float: right;
                }
    
                .exit-btn:hover {
                    color: var(--darkmatter);
                }

                .player-search {
                    display: inline-block;
                    width: 50%;
                    vertical-align: top;
                }

                .input-fields {
                    display: inline-block;
                    margin : 0 auto;
                    width: 100%;
                    padding: 12px 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    outline: none;
                }

                .players-selected {
                    display: inline-block;
                    width: 50%;
                }

                .players-selected > h3 {
                    text-align: center;
                    padding-bottom: 16px;
                }

                .selected-player {
                    display: block;
                    text-align: center;
                    font-size: 1.5em;
                    cursor: pointer;
                    border-left: 1px solid var(--greyapple);
                }

                .btn-send-invites {
                    height: 26px;
                    width: 96px;
                    position: relative;
                    transform: translate(-50%);
                    left: 50%;
                    margin: 16px 0;
                    animation-duration: 0.75s;
                    animation-name: fadein;
                }

                .link-invite {
                    border-top: 1px solid var(--greyapple);
                    padding: 8px;
                    height: max-content;
                }

                section > h3 {
                    text-align: center;
                }

                .link-invite {
                    display: block;
                    padding: 8px;
                }

                .link-invite > input {
                    width: 100%;
                    padding: 10px 0;
                    text-align: center;
                    resize: none;
                    overflow: hidden;
                    border: none;
                    outline: none;
                    font-size: 1.1em;
                    font-weight: bold;
                    font-style: italic;
                    color: var(--darkermatter);
                    background-color: var(--greenapple);
                } 

                .link-invite > button {
                    position: relative;
                    transform: translate(-50%);
                    left: 50%;
                    height: 22px;
                    width: 48px;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }

                /******************
                *  Laptop/tablet  *
                *******************/
                @media only screen and (max-width: 1024px) {
                    .btn-send-invites {
                        height: 32px;
                        width: 112px;
                    }

                    .link-copy > button {
                        height: 32px;
                        width: 64px;
                    }
                }

                /******************
                *     Mobile      *
                *******************/
                @media only screen and (max-width: 600px) {
                    .invite-container {
                        width: 100%;
                        top: 40%;
                    }
                }

                /******************
                *     Short       *
                *******************/
                @media only screen and (max-height: 600px) {
                    .invite-container {
                        transform: translate(-50%, 0%);
                        top: 0%;
                        min-height: 0;
                        height: calc(100% - 70px);
                    }

                    .player-select {
                        min-height: 0;
                        height: 200px;
                    }

                    .link-invite > input {
                        display: inline-block;
                        width: 80%;
                    }

                    .link-invite > button {
                        display: inline-block;
                        width: 20%;
                        position: relative;
                        transform: translate(0%);
                        left: 0%;
                        height: 22px;
                        width: 48px;
                    }
                }
            `}</style>
        </React.Fragment>
    );
}

export default Invite;