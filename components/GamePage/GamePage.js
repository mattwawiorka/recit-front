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
          date: "",
          time: "",
          loading: false
      };
      // bind
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

  componentDidMount() {
    this.getGame();
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
            <GameInfo game={this.state.game} date={this.state.date} time={this.state.time} />
          </div>
        );
      }
    }
}

export default GamePage;