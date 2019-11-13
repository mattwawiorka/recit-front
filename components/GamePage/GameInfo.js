import React from 'react';
import formatDate from '../../lib/formatDate';

const GameInfo = ({ game }) => {

  const start = new Date(parseInt(game.dateTime));
  const startDate = start.toLocaleDateString();
  const startTime =  start.toLocaleTimeString();
  const end = new Date(parseInt(game.endDateTime));
  const endDate = end.toLocaleDateString();
  const endTime = end.toLocaleTimeString();

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
      <div className="dateTime">
        <p>{formatDate.getMonthDayTime((parseInt(game.dateTime)))} 
         - {formatDate.getTime((parseInt(game.endDateTime)))}</p>
      </div>
      <div className="location">
        <h3>{game.venue}</h3>
        <p>{game.address}</p>
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
      }

      .dateTime {
        flex: 0.75;
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .location {
        flex: 1;
        width: 100%;
        display: flex;
        flex: auto;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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