import React, { Component } from 'react';

class GameRow extends Component {
    render() {
      const title = this.props.title;
      const sport = this.props.sport;
      const venue = this.props.venue;
     
      return (
        <tr>
          <td>
            <h3>{title}</h3>
          </td>
          <td>
            <p>{sport}</p>
          </td>
          <td>
            <p>{venue}</p>
          </td>
          <td>
            <form>
              <input type="submit" value="Join Game" />
            </form>
          </td>
        </tr>
      );
    }
}

export default GameRow;