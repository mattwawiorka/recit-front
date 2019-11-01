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
            {CreateGame => <button onClick={CreateGame}>Create Game</button>}
        </Mutation>
    )
}

export default CreateGameButton

