import React, { useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import dateTool from '../../lib/dateTool';
import classNames from 'classnames';

function GameRow(props) {
  const { game, image, loggedIn, onMouseEnter, hovered, clearHovered, getScrollHeight } = props;
  let dateFormat;

  if (parseInt(game.dateTime) < dateTool.getEndOfWeek().valueOf()) {
    dateFormat = dateTool.getDateTime(parseInt(game.dateTime), false, true);
  } else {
    dateFormat = dateTool.getDateTime(parseInt(game.dateTime), true, false)
  }

  if (!loggedIn) {
    dateFormat = "";
    game.venue = "";
  }

  const row = useRef(null);

  const getHovered = useCallback(() => {
    onMouseEnter(game.id)
  })

  useEffect(() => {
    let scrollHeight = hovered ? (row.current.offsetTop - row.current.clientHeight) : null
    if (scrollHeight !== null) getScrollHeight(scrollHeight)
  }, [hovered])

  let rowClass = classNames({
    'game-row': true,
    'hovered': hovered
  })

  const style = 
  <style jsx="true">{`
    .game-row {
      display: flex;
      width: 100%;
      min-height: 4em;
      height: auto;
      padding: 0.5em;
      overflow-x: hidden;
      border-radius: 3px;
    }

    .hovered {
      // background-color: var(--greyapple);
      background-color: #d3d3d3;
      transform: scale(0.97);
      cursor: pointer;
    }

    .sport {
      flex: 0.75;
      padding: 0.5em;
      font-size: 0.65em;
    }

    .sportImage {
      display: block;
      margin-top: 2px;
      margin-left: auto;
      margin-right: auto;
    }

    .dateTime {
      flex: 1;
      padding: 0.5em;
      text-align: center;
      color: #616770;
      font-size: 0.75em;
    }

    .title {
      flex: 2;
      padding: 0.5em;
      text-align: center;
    }

    .venue {
      flex: 1;
      display: flex;
      padding: 0.5em;
      text-align: center;
      justify-content: center;
    }

    .spots {
      padding: 0.5em;
      text-align: center;
      color: #616770;
      font-size: 0.75em;
    }

    @media only screen and (max-width: 1000px) {
      .container {
          //grid-template-columns: 10vw 10vw 10vw 10vw;
          grid-auto-rows: 5em;
          font-size: 0.8em;
          //transform: scale(0.8);
      }
    }
    `}</style>

  if (loggedIn) {
    return (
      <React.Fragment>
        <Link href='/Game/[game]' as={`/Game/${game.id}`} >
          <li className={rowClass} onMouseEnter={getHovered} onMouseLeave={clearHovered} ref={row} >
            <div className="sport">
              <h3 style={{ textAlign: 'center' }} >{game.sport}</h3>
              <img src={image} alt={game.sport} className="sportImage"
                style={{ width: '40%', height: '40%', borderRadius: '10px'}}/>
            </div>
            <div className="dateTime">
              <h3>{dateFormat}</h3>
            </div>
            <div className="title">
              <h3>{game.title}</h3>
            </div>
            <div className="venue">
              <h3>{game.venue}</h3> 
            </div>
            <div className="spots">
              <h3>{game.players + " / " + game.spots}</h3>
            </div>
          </li>
        </Link>
  
        {style}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
          <li className={rowClass} onMouseEnter={getHovered} onMouseLeave={clearHovered} ref={row} >
            <div className="sport">
              <h3 style={{ textAlign: 'center' }} >{game.sport}</h3>
              <img src={image} alt={game.sport} className="sportImage"
                style={{ width: '40%', height: '40%', borderRadius: '10px'}}/>
            </div>
            <div className="dateTime">
              <h3>{dateFormat}</h3>
            </div>
            <div className="title">
              <h3>{game.title}</h3>
            </div>
            <div className="venue">
              <h3>{game.venue}</h3> 
            </div>
            <div className="spots">
              <h3>{game.players + " / " + game.spots}</h3> 
            </div>
          </li>
  
        {style}
      </React.Fragment>
    ); 
  }
}

export default GameRow;