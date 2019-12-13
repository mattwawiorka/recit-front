import React, { useRef } from 'react';
import withAuth from '../../lib/withAuth';

function BottomDockable(props) {

    const loginWarning = useRef();

    const showLoginWarning = () => {
        loginWarning.current.id = "loginWarningShow";
        setTimeout(() => loginWarning.current.id = "loginWarning", 3000)
    }

    let option;
    if (props.startGame) {
        option = "Start New Game";
    } else if (props.submitGame) {
        option = "View Games";
    } else {
        option = "View Games"
    }

    let action;
    if (props.auth.loggedIn()) {
        action = props.clickEvent;
    } 
    else {
        action = showLoginWarning;
    }

    if (props.show) {
        return (
            <React.Fragment>
            <span id='loginWarning' ref={loginWarning}>
                <strong>
                    You must be logged in to start a new game
                </strong>
            </span>

            <button onClick={action} className="bottom-button">
                <h1>{option}</h1>
            </button>

            <style jsx>{`
                .bottom-button {
                    position: fixed;
                    bottom: 0;
                    left: 50%;
                    transform: translate(-50%);
                    width: 40vw;
                    height: 4.5em;
                    border-top-left-radius: 110px; 
                    border-top-right-radius: 110px;
                    border-bottom: 0;
                    outline: none;
                    z-index: 11;
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
        );
    }
}

export default withAuth(BottomDockable);