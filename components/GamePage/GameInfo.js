import React from 'react';

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
        <p>{startDate}</p>
        <p>{startTime}</p>
        <br />
        {/* <p>{endDate}</p> */}
        <p>{endTime}</p>
      </div>
      <div className="location">
        <h3>{game.venue}</h3>
        <p>{game.address}</p>
      </div>
    </div>

    <style jsx>{`
      .container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 2fr 2fr 4fr 4fr 3fr;
        background-color: var(--greenapple); /* Orange */
        // color: white;
        // width: 30vw;
        // height: 45vh;
        // border-radius: 25px;
        // top-margin: 2em;
        // justify-content: space-around;
        height: 80%;
        width: 80%;
        color: white;
        border-radius: 25px;
        margin: auto;
        margin-top: 2em;
        margin-bottom: 2em;
        padding: 1em;
        justify-items: center;
      }

      .container > div {
        // justify-content: center;
        // align-content: center;
      }

      .title {
        // justify-content: center;
        // align-content: center;
      }

      // .sport {
      //   display: flex;
      //   justify-content: center;
      // }

      // .description {
      //   display: flex;
      //   justify-content: center;
      // }

      // .dateTime {
      //   display: grid;
      //   grid-template-columns: 1fr 1fr;
      //   justify-items: center;
      // }

      // .location {
      //   display: flex;
      //   flex: auto;
      //   flex-direction: column;
      //   align-items: center;
      // }
    `}</style>
    </React.Fragment>
  );
}

export default GameInfo;