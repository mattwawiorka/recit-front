// This will eventually be the dockable create game form
// For now just a create game button

import React, { Component } from 'react';

class BottomDockable extends Component {

    render() {
        let option;
        if (this.props.startGame) {
            option = "Start New Game";
        } else if (this.props.submitGame) {
            option = "View Games";
        } else {
            option = "View Games"
        }
        return (
            <React.Fragment>
            <button onClick={this.props.clickEvent} className="createGameButton">
                <h1>{option}</h1>
            </button>

            <style jsx>{`
                .createGameButton {
                    position: fixed;
                    //bottom: 8vh;
                    bottom: 0;
                    left: 30vw;
                    right: 30vw;
                    width: 40vw;
                    height: 4.5em;
                    background-color: var(--darkermatter);
                    color: white;
                    text-align: center;
                    //border-top-left-radius: 50px 20px;
                    //border-top-right-radius: 50px 20px;
                    border-top-left-radius: 110px; 
                    border-top-right-radius: 110px;
                    border-bottom: 0;
                    cursor: pointer;
                }

                .createGameButton:hover {
                    background-color: var(--darkmatter);
                }
            `}</style>
            </React.Fragment>
        );
    }
}

export default BottomDockable;