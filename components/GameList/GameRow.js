import React, { useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import dateTool from '../../lib/dateTool';
import classNames from 'classnames';

function GameRow(props) {
  let {id, title, sport, venue, dateTime, image } = props;
  let dateFormat;

  if (parseInt(dateTime) < dateTool.getEndOfWeek().valueOf()) {
    dateFormat = dateTool.getDateTime(parseInt(dateTime), false, true);
  } else {
    dateFormat = dateTool.getDateTime(parseInt(dateTime), true, false)
  }

  if (!props.loggedIn) {
    dateFormat = "";
    venue = "";
  }

  const row = useRef(null);

  const getHovered = useCallback(() => {
    props.onMouseEnter(id)
  })

  useEffect(() => {
    let scrollHeight = props.hovered ? (row.current.offsetTop - row.current.clientHeight) : null
    if (scrollHeight !== null) props.getScrollHeight(scrollHeight)
  }, [props.hovered])

  let rowClass = classNames({
    'game-row': true,
    'hovered': props.hovered
  })

  return (
    <React.Fragment>
    <Link href='/Game/[game]' as={`/Game/${id}`} >
      <li className={rowClass} onMouseEnter={getHovered} onMouseLeave={props.clearHovered} ref={row} >
        <div className="sport">
          <h3 style={{ textAlign: 'center' }} >{sport}</h3>
          <img src={image} alt={sport} className="sportImage"
            style={{ width: '40%', height: '40%', borderRadius: '10px'}}/>
        </div>
        <div className="dateTime">
          <h3>{dateFormat}</h3>
        </div>
        <div className="title">
          <h3>{title}</h3>
        </div>
        <div className="venue">
          <h3>{venue}</h3> 
        </div>
      </li>
    </Link> 

    <style jsx>{`
      .game-row {
        display: flex;
        width: 100%;
        min-height: 4em;
        height: auto;
        padding: 0.5em;
        //border-bottom-style: groove;
        overflow-x: hidden;
        border-radius: 3px;
      }

      .hovered {
        background-color: var(--greyapple);
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

      @media only screen and (max-width: 1000px) {
        .container {
            //grid-template-columns: 10vw 10vw 10vw 10vw;
            grid-auto-rows: 5em;
            font-size: 0.8em;
            //transform: scale(0.8);
        }
      }
    `}</style>
    </React.Fragment>
  ); 
   
}

export default GameRow;