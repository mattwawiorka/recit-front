import React, { Component } from 'react';
import Link from 'next/link';

class GameRow extends Component {
    render() {
      const id = this.props.id;
      const title = this.props.title;
      const sport = this.props.sport;
      const venue = this.props.venue;
     
      return (
        <Link href={`/Game?id=${id}`} as='/'>
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
          </tr>
        </Link> 
      );
    }
}

export default GameRow;