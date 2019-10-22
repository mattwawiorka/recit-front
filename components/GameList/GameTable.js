import React, { Component } from 'react';
import GameRow from './GameRow';

class GameTable extends Component {
    render() {
      const rows = [];
      
      this.props.games.forEach((game) => {
        rows.push(
          <GameRow
            id={game.id}
            title={game.title}
            sport={game.sport}
            venue={game.venue}
            key={game.id} />
        );
      });
  
      return (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sport</th>
              <th>Venue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );
    }
}

export default GameTable;