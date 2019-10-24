import React, { Component } from 'react';
import axios from 'axios';
import GameTable from './GameTable';
import SearchBar from './SearchBar';
import Loading from '../Loading/Loading';

class GameList extends Component {
  constructor(props) {
    // props
    super(props)
    // state
    this.state = {
      games: [],
      loading: false
    };
    // bind
  }

  getGames() {
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
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
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

  componentDidMount() {
    this.getGames();
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container">
          <Loading></Loading>
        </div>
      );
    } else {
      return (
        <div>
          <GameTable games={this.state.games} />
        </div>
      );
    }
  }
}

export default GameList;