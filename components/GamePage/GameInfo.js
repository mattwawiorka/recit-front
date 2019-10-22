import React, { Component } from 'react';

class GameInfo extends Component {
    render() {
      const title = this.props.game.title;
      const dateTime = this.props.game.dateTime;
      const sport = this.props.game.sport;
      const venue = this.props.game.venue;
      const address = this.props.game.address;
      const description = this.props.game.description;
     
      return (
          <div className="jumbotron text-center">
              <h1>{title}</h1>
              <p>{description}</p>
              <p>{sport}</p>
              <p>{dateTime}</p>
              <p>{venue}</p>
              <p>{address}</p>

              <style jsx>{`
                .jumbotron {
                    background-color: #5bd40a; /* Orange */
                    color: #ffffff;
                }
              `}</style>
          </div>
      );
    }
}

export default GameInfo;