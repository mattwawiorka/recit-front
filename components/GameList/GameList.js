import React, { Component, useEffect } from 'react';
import GameRow from './GameRow';

class GameList extends Component {
  componentDidMount() {
    this.props.subscribeToMore();
    this.props.reload();
  }

  render() {
    const rows = [];
    
    this.props.games.forEach((game) => {
      const d = new Date(parseInt(game.dateTime));
      const startDate = d.toLocaleDateString();
      const startTime =  d.toLocaleTimeString();
      rows.push(
        <GameRow 
          id={game.id}
          title={game.title}
          sport={game.sport}
          venue={game.venue}
          date={startDate}
          time={startTime}
          key={game.id} />
      );
    });

    return (
      <React.Fragment>

        <ul className="container">
          <h3>Upcoming Games</h3>
          {rows}
        </ul>

      <style jsx>{`
        .container {
          margin: 2em;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
          border-radius: 25px;
        }

        h3 {
          margin-bottom: 1em;
        }

        @media only screen and (max-width: 700px) {
          .container {
              grid-template-columns: .25fr 1fr .25fr;
          }
      }
      `}</style>
      </React.Fragment>
    );
  }
}

export default GameList;