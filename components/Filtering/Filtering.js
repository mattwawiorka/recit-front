// This will eventually house the sorting and filtering functionality for the games

import React, { Component } from 'react';

class Filtering extends Component {

    render() {
        return(
            <React.Fragment>
                <div className="container">
                    {/* <p>Filtering</p> */}
                </div>

                <style jsx>{`
                    .container {
                        width: 18vw;
                        height: 76vh;
                        display: flex;
                        justify-content: center;
                        border-radius: 25px;
                        margin-top: 2em;
                        margin-left: 1em;
                    }
                    p {
                        text-align: center;
                        margin-top: 1em;
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default Filtering;