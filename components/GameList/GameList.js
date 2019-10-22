import React, { Component } from 'react';
import axios from 'axios';
import GameTable from './GameTable';
import SearchBar from './SearchBar';
import Loading from '../Loading/Loading';

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
      if (this.state.loading) {
        return (
          <div className="container">
            <Loading></Loading>
          </div>
        );
      } else {
        return (
          <div>
            <SearchBar />
            <GameTable games={this.state.games} />
          </div>
        );
      }
    }
  }

export default GameList;