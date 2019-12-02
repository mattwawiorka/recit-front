import React, { useState, useContext } from 'react';
import GameSource from './GameSource';

function SortingFiltering(props) {
    // const loggedIn = useContext(AuthContext)
    return (
        <React.Fragment>
            <GameSource loggedIn={props.loggedIn} />
        </React.Fragment>
    )
}

export default SortingFiltering;