import React, { Component } from 'react';
import GameRow from './GameRow';
import dateTool from '../../lib/dateTool';
import withAuth from '../../lib/withAuth';

let loggedIn;
let loginWarning = <React.Fragment></React.Fragment>

class GameList extends Component {
  componentDidMount() {
    this.props.subscribeToMore();
    this.props.reload();
    loggedIn = (this.props.auth.loggedIn())
    if (!loggedIn) {
      loginWarning = <strong id="listLoginWarning">Log in to open games and see details</strong>
    }
    else {
      loginWarning = <React.Fragment></React.Fragment>
    }
  }

  render() {

    const todayGames = [];
    const tomorrowGames = [];
    const thisWeekGames = [];
    const nextWeekGames = [];
    const laterGames = [];
    
    this.props.games.forEach((game) => {
      let row = 
        <React.Fragment key={game.id}>
        <GameRow 
          id={game.id}
          title={game.title}
          sport={game.sport}
          venue={game.venue}
          dateTime={game.dateTime} />
          <div id="customBorder"></div>
        </React.Fragment>
      if (parseInt(game.dateTime) < dateTool.getTomorrow().valueOf()) {
        todayGames.push(row);
      } 
      else if (parseInt(game.dateTime) < dateTool.getDayAfterTomorrow().valueOf()) {
        tomorrowGames.push(row);
      }
      else if (parseInt(game.dateTime) < dateTool.getEndOfWeek().valueOf()) {
        thisWeekGames.push(row);
      }
      else if (parseInt(game.dateTime) < dateTool.getEndOfNextWeek().valueOf()) {
        nextWeekGames.push(row);
      }
      else {
        laterGames.push(row);
      }
    });

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
        background-color: #333;
        color: #fff;
        text-align: center; 
        //border-radius: 2px; 
        padding: 8px;
        margin-top: 1em;
        margin-bottom: 0.75em;
        width:85%;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px; 
      }
    `}</style>

    if (todayGames.length > 0) {
      today = 
        <div className="section" >
          <h4 className="chronology">Today</h4>
          {todayGames}
          <div className="chronSpace"></div>
          {chronStyle}
        </div>
    } else {
      today = <React.Fragment></React.Fragment>
    }

    if (tomorrowGames.length > 0) {
      tomorrow = 
        <div className="section" >
          <h4 className="chronology">Tomorrow</h4>
          {tomorrowGames}
          <div className="chronSpace"></div>
          {chronStyle}
        </div>
    } else {
      tomorrow = <React.Fragment></React.Fragment>
    }

    if (thisWeekGames.length > 0) {
      thisWeek = 
        <div className="section" >
          <h4 className="chronology">This Week</h4>
          {thisWeekGames}
          <div className="chronSpace"></div>
          {chronStyle}
        </div>
    } else {
      thisWeek = <React.Fragment></React.Fragment>
    }

    if (nextWeekGames.length > 0) {
      nextWeek = 
        <div className="section" >
          <h4 className="chronology">Next Week</h4>
          {nextWeekGames}
          <div className="chronSpace"></div>
          {chronStyle}
        </div>
    } else {
      nextWeek = <React.Fragment></React.Fragment>
    }

    if (laterGames.length > 0) {
      later = 
        <div className="section" >
          <h4 className="chronology">Later</h4>
          {laterGames}
          {chronStyle}
        </div>
    } else {
      later = <React.Fragment></React.Fragment>
    }

    return (
      <React.Fragment>
      <div className="container">
        <h3 id="upcomingGames">Upcoming Games</h3>
        {loginWarning}
        {today}
        {tomorrow}
        {thisWeek}
        {nextWeek}
        {later}
      </div>
        
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
          border-radius: 15px;
        }

        #upcomingGames {
          border-bottom-style: groove;
          color: #111;
          //font-weight: 300;
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
}

export default withAuth(GameList);