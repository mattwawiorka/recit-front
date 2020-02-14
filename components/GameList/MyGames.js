import React, { useState } from 'react';
import classNames from 'classnames';

function MyGames(props) {
    const [showList, setShowList] = useState();

    const moreGames = props.myGames.length > 1;

    // For view select on mobile
    const listClass = classNames({
        "list-container": true,
        "hide": props.viewMode
    })
    const buttonClass = classNames({
        "btn-expand-list": true,
        "hide": props.viewMode
    })

    return (
        <React.Fragment>
            <div className={listClass} >
                <h3 className="list-title">{"You have " + props.activeCount + " upcoming game" + (moreGames ? "s!" : "!")}</h3>
                
                {props.myGames[0]}

                <div className="full-list">
                    {showList ? props.myGames.slice(1) : null}
                </div>

                {(showList && props.hasMore) ?
                <button className="btn-expand-list btn-load-more" onClick={props.loadMore}>
                    Load more
                </button>
                :
                null}
            </div>

            {moreGames ?
            <button 
                className={buttonClass}
                onClick={() => setShowList(!showList)} 
            >
                {showList ? "Less" : "Show More"}
            </button>
            :
            <br />}

            <style jsx>{`
                .list-container {
                    display: inline-block;
                    width: 570px;
                    height: min-content;
                    // max-height: 80vh;
                    text-align: center;
                    background-color: white;
                    border-radius: 15px;
                    // overflow: auto;
                    padding-top: 0.5em;
                    margin: 0 15px;
                }
        
                .list-title {
                    width: 65%;
                    margin: auto;
                    border-bottom-style: groove;
                    color: #111;
                }

                .btn-expand-list {
                    transform: translate(-50%);
                    margin-left: 50%;
                    width: 10em;
                    margin-bottom: 1em;
                    background-color: white;
                    color: #616770;
                    text-align: center;
                    font-size: 1em;
                    border-bottom-left-radius: 35px; 
                    border-bottom-right-radius: 35px;
                    cursor: pointer;
                    outline: none;
                }

                .btn-load-more {
                    transform: translate(0%);
                    margin-left: 0%;
                    margin-top: 0.5em;
                }

                @media only screen and (max-width: 1600px) {
                    .list-container {
                      width: 400px;
                    }
                }
        
                @media only screen and (max-width: 768px) {
                    .list-container {
                    width: 300px;
                    margin: 0;
                    }
                }

                @media only screen and (max-width: 600px) {
                    .list-container {
                        width: 100%;
                        margin-top: 55px;
                    }

                    .hide {
                        display: none;
                    }
                }

                @media only screen and (max-height: 425px) {
                    .list-container {
                        width: 100%;
                        margin-top: 55px;
                    }

                    .hide {
                        display: none;
                    }
                }
            `}</style>
        </React.Fragment>
    )

}

export default MyGames;