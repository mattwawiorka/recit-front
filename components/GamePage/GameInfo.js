import dateTool from '../../lib/dateTool';
import _ from '../../lib/dateTool';

function GameInfo(props) {

  const { game, isHost, toggleEditing, cancelMode, toggleCancel, cancelGame } = props;

  return (
    <React.Fragment>
    <div className="game-info-container">
      <div className="section">
        <div className="heading-info">
          <h2>{game.title}</h2>
          <div id="customBorder"></div>
          <h4>{game.sport + " - " + (game.public ? "PUBLIC" : "PRIVATE")}</h4>
          <div className="heading-actions">
            {(isHost && !props.isOver) ?
              <>
                <button onClick={toggleEditing} className="btn">Edit</button>
                <button onClick={toggleCancel} className="btn">Cancel</button>
              </>
            : null}
          </div>
        </div>

        <div className="heading-image">
          <img src={game.image} alt={game.sport} className="sport-image" />
        </div>
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
        <i className="material-icons">calendar_today</i>
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
          <i className="material-icons">public</i>
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

      .heading-info {
        display: inline-block;
        width: 85%;
      }

      .heading-info > h2 {
        font-size: 2em;
        word-break: break-all;
      }

      .heading-image {
        display: inline-block;
        float: right;
        width: 15%;
        height: 100%;
      }
      
      .sport-image {
        width: 100%; 
        height: 100%; 
        max-height: 64px;
        max-width: 64px; 
      }

      #customBorder {
        border-bottom-style: solid;
        border-color: white;
        border-width: thin;
        width: 65%;
      }

      .sport {
        display: -block;
        text-align: center;
        width: 100%;
        border-bottom-style: groove;
        border-color: white;
        border-width: thin;
        font-weight: bold;
      }

      .heading-actions {
        padding: 10px 0;
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
        padding: 8px 16px;
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

      i {
        vertical-align: top;
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
        font-size: 0.9em;
        // font-weight: bold;
      }

      .location>a {
        color: white;
      }

      .directions {
        color: white;
      }

      .cancel-box {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 11;
        display: block;
        height: 120px;
        width: 250px;
        color: white;
        background-color: var(--greenapple);
        border-radius: 10px;
        padding: 10px;
        animation-duration: 1.5s;
        animation-name: fadein;
      }

      .cancel-btn {
        margin: 16px auto;
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

      /******************
      *     Mobile      *
      *******************/
      @media only screen and (max-width: 600px) {
        i {
          display: none;
        }
      }
    `}</style>
    </React.Fragment>
  );
}

export default GameInfo;