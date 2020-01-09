import React, { useEffect, useRef } from 'react';
import MyGames from './MyGames';

let loginWarning;

function GameList(props) {

  if (!props.loggedIn) {
    loginWarning = <strong id="listLoginWarning">Log in to open games and see details</strong>
  }
  else {
    loginWarning = null;
  }

  const list = useRef(null);

  useEffect(() => {
    if (props.scroll 
        && ( (props.scrollTo < list.current.scrollTop) || (props.scrollTo > (list.current.scrollTop + list.current.clientHeight)))) 
        list.current.scrollTo(0, props.scrollTo - 100)
  }, [props.scrollTo])

  if (props.sortOrder === "SPOTS") {
    return (
      <React.Fragment>
        <div className="list-container" ref={list}>
          <h3 id="upcomingGames">Upcoming Games</h3>
          {loginWarning}
          {props.gamesBySpots}
        </div>
          
        <style jsx>{`
          .list-container {
            display: block;
            width: 50%;
            height: min-content;
            max-height: 80vh;
            text-align: center;
            background-color: white;
            border-radius: 15px;
            margin-left: 1em;
            overflow: auto;
          }
    
          #upcomingGames {
            margin: auto;
            border-bottom-style: groove;
            width: 50%;
            color: #111;
          }
    
          // @media only screen and (max-width: 700px) {
          //   .container {
          //       grid-template-columns: .25fr 1fr .25fr;
          //   }
          // }
        `}</style>
      </React.Fragment>
    ); 
  }

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
      <div className="list-container" ref={list}>
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
          width: 95%;
          height: min-content;
          max-height: 80vh;
          text-align: center;
          background-color: white;
          border-radius: 15px;
          margin-left: 1em;
          overflow: auto;
        }

        .list-title {
          margin: auto;
          border-bottom-style: groove;
          width: 50%;
          color: #111;
        }

        // @media only screen and (max-width: 700px) {
        //   .container {
        //       grid-template-columns: .25fr 1fr .25fr;
        //   }
        // }
      `}</style>
    </React.Fragment>
  ); 
}

export default GameList;