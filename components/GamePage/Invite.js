import Router from 'next/router';
import React, { useRef } from 'react';

function Invite(props) {

    const URL = "http://localhost:3000" + Router.asPath + "?invited=true";
    const link = useRef(null);

    return (
        <React.Fragment>
            <div className="invite-container">
                <button onClick={props.exit} className="exit-btn" type="button">X</button>
                <h3 className="heading">Shareable Link</h3>
                <p ref={link} className="link">{URL}</p>
            </div>

            <style jsx>{`
                .invite-container {
                    position: fixed;
                    top: 20%;
                    left: 30%;
                    display: block;
                    background-color: var(--greenapple); /* Orange */
                    height: 20em;
                    width: 20em;
                    color: white;
                    margin: auto;
                    margin-top: 2em;
                    padding: 1em;
                    padding-top: 0.5em;
                    border-radius: 15px;
                    z-index: 11;
                }

                .heading {
                    text-align: center;
                    margin-top: 1em;
                }

                .link {
                    text-align: center;
                    margin-top: 1em;
                }

                .exit-btn {
                    position: absolute;
                    right: 1em;
                    background: none;
                    border: none;
                    text-align: center;
                    outline: none;
                    font-weight: bold;
                    color: #4b4f56;
                    cursor: pointer;
                }
            `}</style>
        </React.Fragment>
    );
}

export default Invite;