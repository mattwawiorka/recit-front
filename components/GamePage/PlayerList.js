import React from 'react';

const Host = (props) => {
  if (props.isHost) {
    return (
    <h3>Host - {props.host.name}</h3>
    )
  } else {
    return <h3>No Host</h3>
  }
}

const PlayerList = ({ players }) => {

  const rows = [];
      
  players.forEach((player) => {
    rows.push(
      <tr key={player.id}>
        <th>{player.name}</th>
      </tr>
    );
  });

  let host = players.find(player => {
    return player.role === 1
  })

  let isHost = (host) ? true : false;

  return (
    <div className="jumbotron text-center">
        <br />
        <Host isHost={isHost} host={host} />
        <br />
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