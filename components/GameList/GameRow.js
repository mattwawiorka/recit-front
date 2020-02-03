import React, { useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import dateTool from '../../lib/dateTool';
import classNames from 'classnames';
import cookie from 'js-cookie';

function GameRow(props) {
  const { game, image, onMouseEnter, hovered, clearHovered, getScrollHeight, role } = props;
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

  if (role == 1 ) {
    involvement = "hosting";
  } 
  else if (role == 2) {
    involvement = "joined";
  } 
  else if (role == 3) {
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
      justify-content: space-between;
      min-height: 4em;
      max-height: 6em;
      padding: 0.5em;
      overflow: hidden;
    }

    .hovered {
      // background-color: var(--greyapple);
      background-color: #d3d3d3;
      transform: scale(0.97);
      cursor: pointer;
    }

    .sport {
      display: inline-block;
      vertical-align: middle;
      text-align: justify; 
      margin-left: 1em;
      width: 2.5em;
      height: 2.5em;
    }

    .sportImage {
      width: 2.5em;
      height: 2.5em;
    }

    .dateTime {
      display: inline-block;
      vertical-align: middle;
      text-align: justify; 
      width: 7em;
      height: 100%;
      padding-left: 1em;
      text-align: center;
      color: #616770;
      font-size: 0.65em;
    }

    .title {
      display: inline-block;
      vertical-align: middle;
      padding-left: 1em;
      text-align: center; 
      width: 9em;
      height: 100%;
      color: var(--darkmatter);
    }

    .venue {
      display: inline-block;
      vertical-align: middle;
      text-align: left; 
      width: 8em;
      height: 100%;
      padding-left: 1em;
      color: #616770;
      font-size: 0.65em;
    }

    .spots {
      display: inline-block;
      vertical-align: middle;
      text-align: justify; 
      width: 5em;
      height: 100%;
      padding-left: 1em;
      margin-right: 1em;
      color: #616770;
      font-size: 0.75em;
      font-weight: bold;
    }

    @media only screen and (max-width: 1000px) {
      .spots {
        display: none;
      }
    }

    @media only screen and (max-width: 700px) {
      .dateTime {
        display: none;
      }

      .venue {
        display: none;
      }

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
              <img src={image} alt={game.sport} className="sportImage"/>
            </div>
            <div className="dateTime">
              <h3>{dateFormat}</h3>
            </div>
            <div className="title">
              <h3>{game.title}</h3>
            </div>
            {/* <div className="venue">
              <h3>{game.venue}</h3> 
            </div> */}
            <div className="spots">
              <h3>{role ? involvement : game.players + " / " + game.spots}</h3>
            </div>
          </div>
        </Link>
  
        {style}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
          <li className={rowClass} onMouseEnter={getHovered} onMouseLeave={clearHovered} ref={row} >
            <div className="sport">
              {/* <h3 style={{ textAlign: 'center' }} >{game.sport}</h3> */}
              <img src={image} alt={game.sport} className="sportImage"/>
            </div>
            <div className="dateTime">
              <h3>{dateFormat}</h3>
            </div>
            <div className="title">
              <h3>{game.title}</h3>
            </div>
            {/* <div className="venue">
              <h3>{game.venue}</h3> 
            </div> */}
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