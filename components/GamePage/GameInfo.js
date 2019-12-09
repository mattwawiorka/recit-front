import dateTool from '../../lib/dateTool';

function GameInfo(props) {

  const { game, isHost, toggleEditing } = props;

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
  else {
    image = "rec-it.png";
  }

  return (
    
    <React.Fragment>
    <div className="container">
      <div className="section heading">
        <div className="titleSport">
          <h2 style={{ textAlign: 'left' }}>{game.title}</h2>
          <div id="customBorder"></div>
          <h4 style={{ display: 'inline-block', width: '50%',  }}>{game.sport}</h4>
        </div>
        <div className="sportImage">
          <img src={image} alt={game.sport} className="image" />
        </div>
      </div>

      <div className="section actions">
        {isHost ? <button onClick={toggleEditing} id="editButton">Edit</button> : null}
      </div>

      <div className="section description">
        <p>{game.description}</p>
      </div>

      <div className="section">
        <div className="icon-section">
          <img src="/time-icon.svg" alt="Time" className="icon"
             />
        </div>
        <div className="dateTime">
          <p>{dateTool.getDateTime(parseInt(game.dateTime), true, true)} 
            - {dateTool.getTime((parseInt(game.endDateTime)))}</p>
         </div>
      </div>

      <div className="section">
        <div className="icon-section">
          <img src="/pin.svg" alt="Location" className="icon"  />
        </div>
        <div className="location">
          <h3>{game.venue}</h3>
          <p>{game.address}</p>
        </div>
      </div>
    </div>

    <style jsx>{`
      .container {
        display: block;
        background-color: var(--greenapple); /* Orange */
        height: auto;
        width: 85%;
        color: white;
        margin: auto;
        margin-top: 2em;
        padding: 1em;
        border-radius: 15px;
        // overflow: hidden;
      }

      .section {
        display: block;
        width: 100%;
        padding: 5px 0 5px 0;
      }
      
      .image {
        width: 100%; 
        height: 100%; 
        max-height: 3em;
        max-width: 3em; 
        border-radius: 10px;
      }

      .heading {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
      }

      .titleSport {
        flex: 4;
        margin-right: 10px;
      }

      .sportImage {
        flex: 1;
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

      #editButton {
        width: 20%;
        height: 2em;
        text-align: center;
        background-color: var(--darkermatter);
        color: white;
        padding: 7px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }

      .description {
        width: 100%;
        padding: 0.5em;
        padding-left: 20%;
        //text-align: center;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-weight: 600;
        font-size: 0.9em;
        color: #4b4f56;
        line-height: 15px;
      }

      .icon {
        width: 80%;
        height: 80%; 
        borderRadius: 10px;
        max-height: 2em;
        max-width: 2em;
      }

      .icon-section {
        display: inline-block;
        width: 15%;
        height: 100%;
        padding-left: 10px;
      }

      .dateTime {
        display: inline-block;
        width: 85%;
        height: 100%;
        padding-left: 10px;
      }

      .location {
        display: inline-block;
        width: 85%;
        height: 100%;
        padding-left: 10px;
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