import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_GAME = gql`
     mutation CreateGame($gameInput: gameInput) {
        createGame(gameInput: $gameInput) 
        {
            id
        }
    }
    `;

const CreateGameButton = ({ title, dateTime, endDateTime, venue, address, sport, description }) => {
    return (
        <React.Fragment>
        <Mutation
            mutation={CREATE_GAME}
            variables={{ gameInput: {
                title: title,
                dateTime: dateTime,
                endDateTime: endDateTime,
                venue: venue,
                address: address,
                sport: sport,
                description: description,
                public: true
            } }}
            >
                { CreateGame => {
                    <button onClick={e => {
                        e.preventDefault();
                        CreateGame()
                        .then(response => {
                            console.log(response);
                            if (response.errors) {
                                // this.setState({
                                //     error: response.errors[0].message
                                // })
                                // return;
                            }
                            //Router.push('/');
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    }}>Create Game</button>
                }}
        </Mutation>

        <style jsx>{`
            button {
                width: 50%;
                background-color: var(--darkermatter);
                color: white;
                padding: 14px 20px;
                margin: 1em;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            button:hover {
                background-color: var(--darkmatter);
            }
        `}</style>
        </React.Fragment>
    )
}

export default CreateGameButton

