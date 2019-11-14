import React from 'react';
import dateTool from '../../lib/dateTool';

const GameInfo = ({ game }) => {

  return (
    <React.Fragment>
    <div className="container">
      <div className="title">
        <h1 style={{ textAlign: 'center' }}>{game.title}</h1>
      </div>
      <div className="sport">
        <p>{game.sport}</p>
      </div>
      <div className="description">
        <p>{game.description}</p>
      </div>
      <div className="when">
        <div className="timeIcon">
          <img src="/timeIcon.svg" alt="Time" 
            style={{ width: '60%', height: '40%', borderRadius: '10px'}} />
        </div>
        <div className="dateTime">
          <p>{dateTool.getDateTime(parseInt(game.dateTime), true, true)} 
            - {dateTool.getTime((parseInt(game.endDateTime)))}</p>
         </div>
      </div>
      <div className="where">
        <div className="locationIcon">
          <img src="/timeIcon.svg" alt="Location" 
            style={{ width: '60%', height: '40%', borderRadius: '10px'}}  />
        </div>
        <div className="location">
          <h3>{game.venue}</h3>
          <p>{game.address}</p>
        </div>
      </div>
    </div>

    <style jsx>{`
      .container {
        display: flex;
        flex-direction: column;
        background-color: var(--greenapple); /* Orange */
        height: 85%;
        width: 85%;
        color: white;
        margin: auto;
        margin-top: 2em;
        margin-bottom: 2em;
        padding: 1em;
        justify-items: center;
        border-radius: 15px;
        overflow: auto;
      }

      .title {
        flex: 1.5;
        width: 100%;
        justify-content: center;
        align-content: center;
        border-bottom-style: groove;
        border-color: white;
        border-width: thin;
      }

      .sport {
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        border-bottom-style: groove;
        border-color: white;
        border-width: thin;
        font-weight: bold;
      }

      .description {
        flex: 3;
        width: 100%;
        padding: 0.5em;
        display: flex;
        justify-content: center;
        word-wrap: break-word;
        white-space: pre-wrap;
      }

      .when {
        flex: 0.75;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .timeIcon {
        flex: 1;
        width: 100%;
        height: 100%;
      }

      .dateTime {
        flex: 3;
        width: 100%;
        height: 100%;
      }

      .where {
        flex: 1;
        width: 100%;
        display: flex;
        flex: auto;
        align-items: center;
        margin-top: 0.75em;
        //justify-content: center;
      }

      .locationIcon {
        flex: 1;
        width: 100%;
        height: 100%;
      }

      .location {
        flex: 3;
        width: 100%;
        height: 100%;
      }

      @media only screen and (max-width: 700px) {
        .dateTime {
          // font-size: 0.9em;
          // display: flex;
          // justify-content: center;
          // width: 50%;
        }
    }
    `}</style>
    </React.Fragment>
  );
}

export default GameInfo;