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
        "btn-my-games": true,
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
                <button className="btn-my-games btn-load-more" onClick={props.loadMore}>
                    Load more
                </button>
                :
                null}
            </div>

            {moreGames ?
            <React.Fragment>
                <button 
                    className={buttonClass}
                    onClick={() => setShowList(!showList)} 
                >
                    {showList ? "Less" : "Show More"}
                </button>
                <div className="spacing" />
            </React.Fragment>
            :
            <div className="spacing" />}

            <style jsx>{`
                .list-container {
                    display: block;
                    text-align: center;
                    background-color: white;
                    border-radius: 15px;
                    padding-top: 0.5em;
                    width: 95%;
                    margin: 0 auto;
                }
        
                .list-title {
                    width: 85%;
                    margin: auto;
                    border-bottom-style: groove;
                    color: #111;
                    margin-bottom: 12px;
                }

                .btn-my-games {
                    width: 160px;
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
                    padding: 12px 0;
                }

                .btn-expand-list {
                    transform: translate(-50%);
                    margin-left: 50%;
                }

                .spacing {
                    margin-bottom: 16px;
                }

                /******************
                *     Laptop      *
                *******************/
                @media only screen and (max-width: 1300px) {
                    .list-title {
                        width: 100%;
                        font-size: 0.9em;
                    }
                }

                /******************
                *     Mobile      *
                *******************/
                @media only screen and (max-width: 600px), (max-height: 600px) {
                    .list-container {
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