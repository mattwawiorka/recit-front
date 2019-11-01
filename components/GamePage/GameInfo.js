import React from 'react';

const GameInfo = ({ game }) => {

  const start = new Date(parseInt(game.dateTime));
  const startDate = start.toLocaleDateString();
  const startTime =  start.toLocaleTimeString();
  const end = new Date(parseInt(game.endDateTime));
  const endDate = end.toLocaleDateString();
  const endTime = end.toLocaleTimeString();

  return (
      <div className="jumbotron text-center">
          <h1>{game.title}</h1>
          <p>{game.description}</p>
          <p>{game.sport}</p>
          <p>{startDate}</p>
          <p>{startTime}</p>
          <p>{endDate}</p>
          <p>{endTime}</p>
          <p>{game.venue}</p>
          <p>{game.address}</p>

          <style jsx>{`
            .jumbotron {
                background-color: var(--greenapple); /* Orange */
                color: #ffffff;
            }
          `}</style>
      </div>
  );
}

export default GameInfo;