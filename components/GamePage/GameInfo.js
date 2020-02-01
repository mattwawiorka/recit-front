import dateTool from '../../lib/dateTool';

function GameInfo(props) {

  const { game, isHost, toggleEditing, cancelMode, toggleCancel, cancelGame } = props;

  let image;
  if (game.sport === 'TENNIS') {
    image = "/tennis-ball.svg";
  } 
  else if (game.sport === 'BASKETBALL') {
    image = "/basketball.svg";
  }
  else if (game.sport === 'FOOTBALL') {
    image = "/american-football.svg";
  } 
  else if (game.sport === 'SOCCER') {
    image = "/soccer-ball.png";
  } 
  else {
    image = "/rec-it.png";
  }

  return (
    <React.Fragment>
    <div className="game-info-container">
      <div className="section heading">
        <div className="titleSport">
          <h2 style={{ textAlign: 'left', fontSize: "2em" }}>{game.title}</h2>
          <div id="customBorder"></div>
          <h4 style={{ display: 'inline-block', width: '50%',  }}>{game.sport}</h4>
        </div>
        <div className="sport-image">
          <img src={image} alt={game.sport} className="image" />
        </div>
      </div>

      <div className="section actions">
        {(isHost && !props.isOver) ?
          <>
            <button onClick={toggleEditing} className="btn">Edit</button>
            <button onClick={toggleCancel} className="btn">Cancel</button>
          </>
        : null}
      </div>

      {cancelMode ? 
        <div className="cancel-box">
          <h3 className="heading" style={{ textAlign: 'center' }}>Are you sure you want to cancel your game?</h3>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <button onClick={cancelGame} className="btn cancel-btn">Yes</button>
            <div className="cancel-btn" style={{ width: '1em'}}/>
            <button onClick={toggleCancel} className="btn cancel-btn">No</button>
          </div>
        </div>
      : null}
      
      <div className="section description">
        <p>{game.description}</p>
      </div>

      <div className="section">
        <img src="/time-icon.svg" alt="Time" className="icon icon-section"/>
        <div className="dateTime">
          <p>{dateTool.getDateTime(parseInt(game.dateTime), true, true) + " - " + dateTool.getTime((parseInt(game.endDateTime)))}</p>
         </div>
      </div>

      <div className="section">
        <a 
          target="_blank"
          href={`https://www.google.com/maps/dir/?api=1&destination=${game.address}`}
          className="directions"
        >
          <img src="/pin.svg" alt="Location" className="icon icon-section"  />
          <div className="location">
            <h3>{game.venue}</h3>
            <h3>{game.address}</h3>
          </div>
        </a>
      </div>
    </div>

    <style jsx>{`
      .game-info-container {
        display: block;
        background-color: var(--greenapple); /* Orange */
        height: auto;
        width: 90%;
        color: white;
        margin: auto;
        margin-top: 2em;
        padding: 1em;
        padding-top: 0.5em;
        border-radius: 15px;
        // overflow: hidden;
        border-bottom-style: groove;
      }

      .section {
        display: block;
        width: 100%;
        padding: 5px 0 5px 0;
      }
      
      .image {
        width: 100%; 
        height: 100%; 
        max-height: 4em;
        max-width: 4em; 
      }

      .heading {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
      }

      .titleSport {
        flex: 4;
        margin-right: 10px;
        margin-top: -0.5em;
      }

      .sport-image {
        flex: 1;
        float: right;
        width: 100%;
        height: 100%;
      }

      #customBorder {
        border-bottom-style: solid;
        border-color: white;
        border-width: thin;
        width: 65%;
      }

      .sport {
        display: inline-block;
        text-align: center;
        width: 100%;
        border-bottom-style: groove;
        border-color: white;
        border-width: thin;
        font-weight: bold;
      }

      .actions {
        position: relative;
        top: -0.5em;
        padding-top: 0em;
        vertical-align: top;
      }

      .btn {
        width: 5em;
        height: 2em;
        margin: 0 2em 1em 0;
      }

      .btn:hover {
        background-color: var(--darkmatter);
      }

      .description {
        width: 100%;
        padding: 0.5em;
        padding-left: 10%;
        padding-left: 10%;
        text-align: justify;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-weight: 600;
        font-size: 1em;
        // color: #4b4f56;
        color: var(--darkermatter);
        line-height: 15px;
        margin-bottom: 1em;
      }

      .icon {
        width: 2.5em;
        height: 2.5em; 
        borderRadius: 10px;
        max-height: 3em;
        max-width: 3em;
      }

      .icon-section {
        display: inline-block;
        padding-left: 10px;
      }

      .dateTime {
        display: inline-block;
        vertical-align: 75%;
        height: 100%;
        padding-left: 15px;
        font-weight: bold;
      }

      .location {
        display: inline-block;
        height: 100%;
        padding-left: 15px;
        font-weight: bold;
      }

      .location>a {
        color: white;
      }

      .directions {
        color: white;
      }

      .cancel-box {
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 11;
        display: block;
        height: min-content;
        width: min-content;
        min-width: 20em;
        color: white;
        background-color: var(--greenapple);
        border-radius: 10px;
        padding: 10px;
        animation-duration: 1.5s;
        animation-name: fadein;
      }

      .cancel-btn {
        margin: 1em auto;
        display: inline-block;
      }

      @keyframes fadein {
        from {
            opacity: 0;
        } 
        
        to {
            opacity: 1;
        }
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