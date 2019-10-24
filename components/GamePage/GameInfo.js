import React, { Component } from 'react';

class GameInfo extends Component {

  render() {
    const title = this.props.game.title;
    const date = this.props.date;
    const time = this.props.time;
    const sport = this.props.game.sport;
    const venue = this.props.game.venue;
    const address = this.props.game.address;
    const description = this.props.game.description;
    const players = this.props.players;

    const rows = [];
      
      players.forEach((player) => {
        rows.push(
          <tr>
            <th>{player.name}</th>
          </tr>
        );
    });

    return (
        <div className="jumbotron text-center">
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{sport}</p>
            <p>{date}</p>
            <p>{time}</p>
            <p>{venue}</p>
            <p>{address}</p>

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
                  background-color: #006408; /* Orange */
                  color: #ffffff;
              }
            `}</style>
        </div>
    );
  }
}

export default GameInfo;