import React, { Component } from 'react';
import GameList from './GameList/GameList';
import SearchBar from './GameList/SearchBar';
import Loading from './Loading/Loading';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_GAMES_QUERY = gql`
  {
    games {
      id
      title
      sport
      venue
      dateTime
    }
  }
`;

const GAME_ADDED = gql`
  subscription {
    gameAdded {
      id
      title
      sport
      venue
      dateTime
    }
  }
`;

// Not implementing subscription for game removes (yet?)
const GAME_REMOVED = gql`
  subscription {
    gameDeleted
  }
`;

class Games extends Component {
  constructor(props) {
    // props
    super(props)
    // state
    this.state = {
        listView: true,
        mapView: false
    };
  }

  componentDidMount() {
    console.log('yo?')
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    console.log(window.innerHeight)
    console.log(document.documentElement.scrollTop)
    console.log(document.getElementById('gameList').offsetHeight)
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    console.log('fetch more games!')
  }

  render() {
    return (
      <Query query={GET_GAMES_QUERY}>
        {
          ({ loading, error, data, refetch, subscribeToMore }) => {
            if (loading) return <Loading></Loading>
            if (error) return <h4>ERROR</h4>

            const more = () => subscribeToMore({
              document: GAME_ADDED,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newGame = subscriptionData.data.gameAdded;
                const newGames = Object.assign({}, prev, {games: [...prev.games, newGame]});
                return newGames
              }
            })

            const chronilogicalGames = data.games.sort( (a,b) => {
              let comparison;
              if (parseInt(a.dateTime) > parseInt(b.dateTime)) {
                  comparison = 1;
              } else {
                  comparison = -1;
              }
              return comparison;
            })

            if (this.state.listView) {
                return (
                    <div id="gameList" style={{ width: '100%', height: 'auto', padding: '1.2em', marginBottom: '4em' }}>
                      {typeof this.props.loggedIn !== 'undefined' ? <GameList games={chronilogicalGames} subscribeToMore={more} reload={refetch} loggedIn={this.props.loggedIn} /> : <Loading />}
                    </div>
                )
            }
            
            if (this.state.mapView) {
                return (
                    <div>
                        MAP
                    </div>
                )
            }
            
          }
        }
      </Query>
    );
  }
}

export default Games;

