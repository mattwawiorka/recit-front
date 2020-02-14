import React, { useEffect, useRef } from 'react';
import cookie from 'js-cookie';
import classNames from 'classnames';

let loginWarning;

function GameList(props) {

  if (!cookie.get('token')) {
    loginWarning = <strong id="listLoginWarning">Log in to open games</strong>
  }
  else {
    loginWarning = null;
  }

  const list = useRef(null);

  // useEffect(() => {
  //   if (props.scroll 
  //       && ( (props.scrollTo < list.current.scrollTop) || (props.scrollTo > (list.current.scrollTop + list.current.clientHeight)))) 
  //       list.current.scrollTo(0, props.scrollTo - 100)
  // }, [props.scrollTo])

  // For view select on mobile
  const listClass = classNames({
    "list-container": true,
    "hide": props.viewMode
  })

  let today, tomorrow, thisWeek, nextWeek, later;
  const chronStyle = 
  <style jsx="true">{`
    .chronology {
      padding: 0.5em;
      text-align: left;
      color: #616770;
      font-style: italic;
      text-decoration: underline;
    }

    .section {
      width: 100%;
      //margin-top: 0.75em;
    }

    #customBorder {
      border-bottom-style: groove;
      border-width: thin;
      width: 85%;
      margin: 0 auto;
    }

    .chronSpace {
      background-color: var(--greyapple);
      height: 1em;
    }

    #listLoginWarning {
      display: block;
      background-color: #333;
      color: #fff;
      text-align: center; 
      //border-radius: 2px; 
      padding: 8px;
      margin: 1em auto 0.75em auto;
      width:85%;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px; 
      -webkit-animation: fadein 1s;
      animation: fadein 1s;
    }

    @-webkit-keyframes fadein {
      from {opacity: 0;}
      to {opacity: 1;}
    }

    @keyframes fadein {
      from {opacity: 0;}
      to {opacity: 1;}
    }
  `}</style>

  if (props.todayGames.length > 0) {
    today = 
      <div className="section" >
        <h4 className="chronology">Today</h4>
        {props.todayGames}
        <div className="chronSpace"></div>
        {chronStyle}
      </div>
  } else {
    today = null;
  }

  if (props.tomorrowGames.length > 0) {
    tomorrow = 
      <div className="section" >
        <h4 className="chronology">Tomorrow</h4>
        {props.tomorrowGames}
        <div className="chronSpace"></div>
        {chronStyle}
      </div>
  } else {
    tomorrow = null;
  }

  if (props.thisWeekGames.length > 0) {
    thisWeek = 
      <div className="section" >
        <h4 className="chronology">This Week</h4>
        {props.thisWeekGames}
        <div className="chronSpace"></div>
        {chronStyle}
      </div>
  } else {
    thisWeek = null;
  }

  if (props.nextWeekGames.length > 0) {
    nextWeek = 
      <div className="section" >
        <h4 className="chronology">Next Week</h4>
        {props.nextWeekGames}
        <div className="chronSpace"></div>
        {chronStyle}
      </div>
  } else {
    nextWeek = null;
  }

  if (props.laterGames.length > 0) {
    later = 
      <div className="section" >
        <h4 className="chronology">Later</h4>
        {props.laterGames}
        {chronStyle}
      </div>
  } else {
    later = null;
  }

  return (
    <React.Fragment>
      <div className={listClass} ref={list}>
        <h3 className="list-title">Games in Your Area</h3>
        {loginWarning}
        {today}
        {tomorrow}
        {thisWeek}
        {nextWeek}
        {later}
      </div>
        
      <style jsx>{`
        .list-container {
          display: block;
          width: 570px;
          height: min-content;
          max-height: 85vh;
          text-align: center;
          background-color: white;
          border-radius: 15px;
          margin: 0 15px;
          // overflow: hidden;
        }

        .list-title {
          margin: auto;
          border-bottom-style: groove;
          width: 50%;
          color: #111;
        }

        @media only screen and (max-width: 1600px) {
          .list-container {
            width: 400px;
          }
        }

        @media only screen and (max-width: 768px) {
          .list-container {
            width: 300px;
            margin: 0;
          }
        }

        @media only screen and (max-width: 600px) {
          .list-container {
            width: 100%;
            height: max-content;
          }

          .hide {
            display: none;
          }
        }

        @media only screen and (max-height: 425px) {
          .list-container {
            width: 100%;
            height: max-content;
          }

          .hide {
            display: none;
          }
        }
      `}</style>
    </React.Fragment>
  ); 
}

export default GameList;