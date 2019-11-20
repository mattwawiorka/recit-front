// This will eventually be the dockable create game form
// For now just a create game button

import React, { Component } from 'react';
import withAuth from '../../lib/withAuth';

let loggedIn;

class BottomDockable extends Component {

    showLoginWarning() {
        const warning = document.getElementById('loginWarning')
        warning.id = "loginWarningShow";
        setTimeout(() => warning.id = "loginWarning", 3000)
    }

    componentDidMount() {
        console.log('game button mounts')
        loggedIn = this.props.auth.loggedIn();
    }

    render() {
        console.log('game button renders')
        let option;
        if (this.props.startGame) {
            option = "Start New Game";
        } else if (this.props.submitGame) {
            option = "View Games";
        } else {
            option = "View Games"
        }

        let action;
        if (loggedIn) {
            action = this.props.clickEvent;
        } 
        else {
            action = this.showLoginWarning;
        }

        if (this.props.show) {
            return (
                <React.Fragment>
                <span id='loginWarning'>
                    <strong>
                        You must be logged in to start a new game
                    </strong>
                </span>

                <button onClick={action} className="createGameButton">
                    <h1>{option}</h1>
                </button>

                <style jsx>{`
                    .createGameButton {
                        position: fixed;
                        bottom: 0;
                        left: 30vw;
                        right: 30vw;
                        width: 40vw;
                        height: 4.5em;
                        background-color: var(--darkermatter);
                        color: white;
                        text-align: center;
                        border-top-left-radius: 110px; 
                        border-top-right-radius: 110px;
                        border-bottom: 0;
                        cursor: pointer;
                        outline: none;
                    }

                    .createGameButton:hover {
                        background-color: var(--darkmatter);
                    }

                    #loginWarning {
                        visibility: hidden;
                        position: fixed;
                        bottom: 10vh;
                        left: 30vw;
                        right: 30vw;
                        width: 40vw;
                        background-color: #333;
                        color: #fff;
                        text-align: center; 
                        border-radius: 2px; 
                        padding: 16px;
                    }

                    #loginWarningShow {
                        visibility: visible;
                        position: fixed;
                        bottom: 10vh;
                        left: 30vw;
                        right: 30vw;
                        width: 40vw;
                        background-color: #333;
                        color: #fff;
                        text-align: center; 
                        border-radius: 2px; 
                        padding: 16px;
                        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
                        animation: fadein 0.5s, fadeout 0.5s 2.5s;
                    }

                    /* Animations to fade the login warning in and out */
                    @-webkit-keyframes fadein {
                        from {bottom: 0; opacity: 0;}
                        to {bottom: 10vh; opacity: 1;}
                    }

                    @keyframes fadein {
                        from {bottom: 0; opacity: 0;}
                        to {bottom: 10vh; opacity: 1;}
                    }

                    @-webkit-keyframes fadeout {
                        from {bottom: 10vh; opacity: 1;}
                        to {bottom: 0; opacity: 0;}
                    }

                    @keyframes fadeout {
                        from {bottom: 10vh; opacity: 1;}
                        to {bottom: 0; opacity: 0;}
                    }

                `}</style>
                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment></React.Fragment>
            )
        }
    }
}

export default withAuth(BottomDockable);