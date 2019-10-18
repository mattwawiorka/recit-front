import React, { Component } from 'react';
import axios from 'axios';
import Loading from '../Loading/Loading';

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

class GameTable extends Component {
  render() {
    const rows = [];
    
    this.props.games.forEach((game) => {
      rows.push(
        <GameRow
          title={game.title}
          sport={game.sport}
          venue={game.venue}
          key={game.id} />
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sport</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends Component {
  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." />
      </form>
    );
  }
}

class FilterableGameTable extends Component {
  render() {
    return (
      <div>
        <SearchBar />
        <GameTable games={this.props.games} />
      </div>
    );
  }
}

class GameList extends Component {
    constructor(props) {
      super(props)
      // state
      this.state = {
        games: [],
        loading: false
      };
      // bind
      this.handleJoin = this.handleJoin.bind(this);
    }
  
    getGames() {
      this.setState({
        loading: true
      })
      const graphqlQuery = {
        query: `
          {
            games {
              title
              sport
              venue
            }
          }
        `
      };
      axios({
        url: 'http://localhost:8080/graphql',
        method: 'post',
        data: graphqlQuery
      })
      .then( response => { 
        this.setState({
          games: response.data.data.games,
          loading: false
        })
      })
      .catch( err => {
        console.log(err);
      })
    }
  
    joinGame() {
      this.setState({
        loading: true
      })
      const graphqlQuery = {
        query: `
          {
            games {
              id
              title
              sport
              venue
            }
          }
        `
      };
      axios({
        url: 'http://localhost:8080/graphql',
        method: 'post',
        data: graphqlQuery
      })
      .then( response => { 
        this.setState({
          games: response.data.data.games,
          loading: false
        })
      })
      .catch( err => {
        console.log(err);
      })
    }
  
    handleJoin(e) {
      e.preventDefault();
      this.joinGame();
    }
  
    componentDidMount() {
      this.getGames();
    }
  
    render() {
      return <FilterableGameTable games={this.state.games} />
      // return (
      //   <div className="App">
      //       <div className="jumbotron">
      //           <h2>Recit</h2>
      //           <p className="lead">Games List</p>
      //       </div>
      //     {!this.state.loading ? (
      //       this.state.games.map( (game, i) => {
      //         return (
      //           <div>
      //             <h3 key={i}>{game.title}</h3>
      //             <p key={i}>{game.sport}</p>
      //             <p key={i}>{game.venue}</p>
      //             <form onSubmit={this.handleJoin}>
      //               <input type="submit" value="Join Game" />
      //             </form>
      //           </div>
      //         )
      //       })
      //     ) : (<Loading />)}
      //   </div>
      // )
    }
  }

export default GameList;