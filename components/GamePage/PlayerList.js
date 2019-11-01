import React from 'react';

const PlayerList = ({ players }) => {

  const rows = [];
      
  players.forEach((player) => {
    rows.push(
      <tr key={player.id}>
        <th>{player.name}</th>
      </tr>
    );
  });

  return (
    <div className="jumbotron text-center">

        <table className="table table-hover">
        <thead>
          <tr>
            <th>Players</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

        <style jsx>{`
          .jumbotron {
              background-color: var(--greenapple); /* Orange */
              color: #ffffff;
          }
        `}</style>
    </div>
);
}

export default PlayerList;