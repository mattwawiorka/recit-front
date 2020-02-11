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
            searchResults = data.findUser.edges.map( (user, index) => {
                if (players.filter(p => p.name === user.node.name).length > 0) return
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
                        `}</style>
                    </React.Fragment>
                );
            })
        }
    }

    const copyText = useCallback((e) => {
        link.current.select();
        document.execCommand('copy');
        e.target.focus();
    }, [])

    return (
        <React.Fragment>
            <div className="invite-container">
                <div className="section header">
                    <button 
                        onClick={props.exit} 
                        className="exit-btn" 
                        type="button"
                    >X</button>
                </div>

                <div className="section player-select">
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
                    
                </div>
                
                <div className="section link-invite">
                    <h3>Shareable Link</h3>
                    <div className="link-copy">
                        <input 
                            type="text"
                            ref={link} 
                            className="game-link" 
                            readOnly
                            value={URL}
                        />
                        <button onClick={(e) => copyText(e)}>Copy</button>
                    </div>
                </div>
                
            </div>

            <style jsx>{`
                .invite-container {
                    position: absolute;
                    top: 35%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 11;
                    display: block;
                    min-height: 30vh;
                    max-height: 75vh;
                    width: 35vw;
                    color: white;
                    background-color: var(--greenapple);
                    border-radius: 10px;
                    padding: 10px;
                    animation-duration: 1.5s;
                    animation-name: fadein;
                    overflow: auto;
                }

                .section {
                    display: block
                    width: 100%;
                }

                .header {
                    height: 2vh;
                }

                .player-select {
                    min-height: 21vh;
                }

                .link-invite {
                    height: 7vh;
                }

                .exit-btn {
                    float: right;
                    background: none;
                    border: none;
                    text-align: center;
                    outline: none;
                    font-weight: bold;
                    color: #4b4f56;
                    cursor: pointer;
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
                    position: relative;
                    width: 50%;
                }

                .players-selected>h3 {
                    text-align: center;
                    margin-bottom: 1em;
                }

                .selected-player {
                    display: block;
                    text-align: center;
                    font-size: 1.5em;
                    cursor: pointer;
                }

                .btn-send-invites {
                    height: 1.75em;
                    width: 7.5em;
                    margin-top: 1em;
                    position: absolute;
                    transform: translate(-50%);
                    // bottom: 0;
                    left: 50%;
                    animation-duration: 0.75s;
                    animation-name: fadein;
                }

                .link-invite > h3 {
                    text-align: center;
                    margin-top: 1em;
                }

                .link-copy {
                    display: inline-block;
                    width: 100%;
                    text-align: center;
                }

                .game-link {
                    text-align: center;
                    min-width: 50%;
                    margin-top: 0.5em;
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

                .link-copy > button {
                    vertical-align: middle;
                    height: 2em;
                    width: 4em;
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

export default Invite;