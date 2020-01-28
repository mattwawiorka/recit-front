import React, { useState } from 'react';

function MyGames(props) {
    const [showList, setShowList] = useState();

    const moreGames = props.myGames.length > 1;

    return (
        <React.Fragment>
            <div className="list-container" >
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
                className="btn-expand-list"
                onClick={() => setShowList(!showList)} 
            >
                {showList ? "Less" : "Show More"}
            </button>
            :
            <br />}

            <style jsx>{`
            .list-container {
                display: block;
                width: 95%;
                height: min-content;
                // max-height: 80vh;
                text-align: center;
                background-color: white;
                border-radius: 15px;
                margin-left: 1em;
                // overflow: auto;
                padding-top: 0.5em;
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

            .btn-expand-list:hover {
                
            }
    
            // @media only screen and (max-width: 700px) {
            //   .container {
            //       grid-template-columns: .25fr 1fr .25fr;
            //   }
            // }
            `}</style>
        </React.Fragment>
    )

}

export default MyGames;