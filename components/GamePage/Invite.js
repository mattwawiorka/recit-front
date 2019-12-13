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
                    position: absolute;
                    top: 25%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 11;
                    display: block;
                    height: 20vh;
                    max-height: 75vh;
                    width: 25vw;
                    max-width: 50vw;
                    color: white;
                    background-color: var(--greenapple);
                    border-radius: 10px;
                    padding: 10px;
                    animation-duration: 1.5s;
                    animation-name: fadein;
                    overflow: auto;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
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