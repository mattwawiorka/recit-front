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
      // bind
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

            if (this.state.listView) {
                return (
                    <div>
                      <GameList games={data.games} subscribeToMore={more} reload={refetch} />
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

export default Games

