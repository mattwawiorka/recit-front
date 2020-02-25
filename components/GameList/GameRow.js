import React, { useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import dateTool from '../../lib/dateTool';
import classNames from 'classnames';
import cookie from 'js-cookie';

function GameRow(props) {
  const { game, onMouseEnter, hovered, clearHovered, getScrollHeight, level } = props;
  let dateFormat, involvement;

  if (parseInt(game.dateTime) < dateTool.getEndOfWeek().valueOf()) {
    dateFormat = dateTool.getDateTime(parseInt(game.dateTime), false, true);
  } else {
    dateFormat = dateTool.getDateTime(parseInt(game.dateTime), true, false)
  }

  if (!cookie.get('token')) {
    dateFormat = "";
    game.venue = "";
  }

  const row = useRef(null);

  const getHovered = useCallback(() => {
    onMouseEnter(game.id, false)
  })

  useEffect(() => {
    let scrollHeight = hovered ? (row.current.offsetTop - row.current.clientHeight) : null
    if (scrollHeight !== null) getScrollHeight(scrollHeight)
  }, [hovered])

  if (level == 1 ) {
    involvement = "hosting";
  } 
  else if (level == 2) {
    involvement = "joined";
  } 
  else if (level == 3) {
    involvement = "interested";
  }

  let rowClass = classNames({
    'game-row': true,
    'hovered': hovered
  })

  const style = 
  <style jsx="true">{`
    .game-row {
      display: flex;
      justify-content: space-evenly;
      height: 55px;
      padding: 6px 8px;
      overflow: hidden;
      background-color: white;
      border-radius: 15px;
    }

    .hovered {
      // background-color: #d3d3d3;
      transform: scale(0.97);
      cursor: pointer;
    }

    .sport {
      vertical-align: middle;
      text-align: justify; 
      width: 2.5em;
      height: 2.5em;
    }

    .sportImage {
      width: 40px;
      height: 40px;
      animation: spin 10s linear infinite;
    }

    .dateTime {
      vertical-align: middle;
      text-align: justify; 
      width: 7em;
      height: 100%;
      text-align: center;
      color: #616770;
      font-size: 0.65em;
    }

    .title {
      vertical-align: top;
      text-align: center; 
      width: 9em;
      height: 100%;
      font-size: 0.9em;
      font-weight: bold;
      color: var(--darkmatter);
    }

    .spots {
      vertical-align: middle;
      text-align: justify; 
      width: 5em;
      height: 100%;
      color: #616770;
      font-size: 0.75em;
      font-weight: bold;
    }

    @media only screen and (max-width: 1300px) {
      .title {
        display: none;
      }

      .game-row {
        padding: 6px 0;
        // padding-right: 32px;
      }
    }

    @media only screen and (max-width: 768px) {
      .spots {
        display: none;
      } 
    }
  `}</style>

  // If logged in, link to games
  if (cookie.get('token')) {
    return (
      <React.Fragment>
        <Link href='/Game/[game]' as={`/Game/${game.id}`} shallow={true} >
          <div className={rowClass} onMouseEnter={getHovered} onMouseLeave={clearHovered} ref={row} >
            <div className="sport">
              <img src={game.image} alt={game.sport} className="sportImage"/>
            </div>
            <div className="dateTime">
              <h3>{dateFormat}</h3>
            </div>
            <div className="title">
              <h3>{game.title.length > 25 ? game.title.substr(0, 25) + "..." : game.title}</h3>
            </div>
            <div className="spots">
              <h3>{level ? involvement : (game.players + game.spotsReserved) + " / " + game.spots}</h3>
            </div>
          </div>
        </Link>
  
        {style}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
          <div className={rowClass} onMouseEnter={getHovered} onMouseLeave={clearHovered} ref={row} >
            <div className="sport">
              <img src={game.image} alt={game.sport} className="sportImage"/>
            </div>
            {/* <div className="dateTime">
              <h3>{dateFormat}</h3>
            </div> */}
            <div className="title">
              <h3>{game.title.length > 25 ? game.title.substr(0, 25) + "..." : game.title}</h3>
            </div>
            <div className="spots">
              <h3>{level ? involvement : (game.players + game.spotsReserved) + " / " + game.spots}</h3>
            </div>
          </div>
  
        {style}
      </React.Fragment>
    ); 
  }
}

export default GameRow;