import React, { Component } from 'react';
import Loading from '../Loading/Loading';
import GameInfo from '../GamePage/GameInfo';
import axios from 'axios';

class GamePage extends Component {
  constructor(props) {
      // props
      super(props)
      // state
      this.state = {
          game: {},
          players: [],
          date: "",
          time: "",
          loading: false
      };
      // bind
      this.handleJoin = this.handleJoin.bind(this);
    }

  getGame() {
    this.setState({
      loading: true
    })
    const graphqlQuery = {
      query: `
      {
          game(id: "${this.props.gameId}") {
              id
              title
              dateTime
              venue
              address
              sport
              description
          }
    }
    `,
      variables: {
        gameId: this.props.gameId
      }
    };
    axios({
      url: 'http://localhost:8080/graphql',
      method: 'post',
      data: graphqlQuery
    })
    .then( response => { 
      const d = new Date(parseInt(response.data.data.game.dateTime));
      this.setState({
        game: response.data.data.game,
        loading: false,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString()
      })
    })
    .catch( err => {
      console.log(err);
    })
  }

  getPlayers() {
    this.setState({
      loading: true
    })
    const graphqlQuery = {
      query: `
        {
          players(gameId: "${this.props.gameId}") {
              name
          }
        }
    `,
      variables: {
        gameId: this.props.gameId
      }
    };
    axios({
      url: 'http://localhost:8080/graphql',
      method: 'post',
      data: graphqlQuery
    })
    .then( response => { 
      this.setState({
        loading: false,
        players: response.data.data.players,
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
        mutation {
          joinGame(gameId: ${this.state.game.id}) 
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
      this.getPlayers();
      this.setState({
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
    this.getGame();
    this.getPlayers();
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
            <GameInfo game={this.state.game} date={this.state.date} time={this.state.time} players={this.state.players} />
            <button 
              className="btn btn-raised btn-primary"
              onClick={this.handleJoin}>
              Join Game
            </button>
          </div>
        );
      }
    }
}

export default GamePage;