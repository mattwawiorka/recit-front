import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import GamesPrep from './GamesPrep';
import Loading from '../Loading/Loading';

const GET_GAMES = gql`
query Games($cursor: String, $sport: String, $startDate: String, $openSpots: String, $currentLoc: [Float], $bounds: [Float], $sortOrder: String) {
  games(cursor: $cursor, sport: $sport, startDate: $startDate, openSpots: $openSpots, currentLoc: $currentLoc, bounds: $bounds, sortOrder: $sortOrder) @connection(key: "GameFeed") {
    edges {
      node {
        id
        title
        sport
        venue
        dateTime
        location {
          coordinates
        }
        spots
        players
      }
      cursor
      distance
    }
    pageInfo {     
      endCursor
      hasNextPage
    }
  }

  userGames {
    edges {
        node {
          id
          title
          sport
          dateTime
        }
        role
    }
    activeCount
  }
}
`;

const GAME_ADDED = gql`
  subscription onGameAdded($cursor: String, $numGames: Int, $bounds: [Float]) {
    gameAdded(cursor: $cursor, numGames: $numGames, bounds: $bounds) {
      cursor
      node {
        id
        title
        sport
        venue
        dateTime
        location {
          coordinates
        }
        spots
        players
      }
    }
  }
`;

const GAME_DELETED = gql`
  subscription onGameDeleted($loadedGames: [ID]) {
    gameDeleted(loadedGames: $loadedGames) 
  }
`;

function GameSource(props) {
  
  let variables = {
    currentLoc: props.currentLoc,
    sport: props.sport,
    startDate: props.startDate,
    openSpots: props.openSpots,
    bounds: props.bounds,
    sortOrder: props.sortOrder
  };

  useEffect(() => {
    if (props.bounds) {
      refetch();
    }
  }, [props.sport, props.startDate, props.bounds, props.sortOrder, props.openSpots])

  const { data, loading, error, refetch, subscribeToMore, fetchMore } = useQuery(GET_GAMES, {variables: variables, ssr: true});
  if (loading) return <Loading />
  if (error) return <p>Error</p>

  return (
    <>
    {typeof props.loggedIn !== 'undefined' ?
    <GamesPrep
      loggedIn={props.loggedIn} 
      currentLoc={props.currentLoc}
      getMapBounds={props.getMapBounds}
      bounds={props.bounds}
      zoom={props.zoom}
      games={data.games.edges || []} 
      myGames={data.userGames.edges || []}
      hasMore={data.games.pageInfo.hasNextPage}
      sortOrder={props.sortOrder}
      loadMore={() => 
        fetchMore({
          variables: {cursor: data.games.pageInfo.endCursor},
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.games.edges.length === 0) return prev;
            const newGameFeed = Object.assign({}, prev, { games: {
              edges: [...prev.games.edges, ...fetchMoreResult.games.edges], 
              pageInfo: {
                endCursor: fetchMoreResult.games.pageInfo.endCursor,
                hasNextPage: fetchMoreResult.games.pageInfo.hasNextPage,
                __typename: "PageInfo"
              }, 
              __typename: "GameFeed"
            }
            });
            return newGameFeed
          }
        })
      }
      subscribeToGames={() => {
        subscribeToMore({
          document: GAME_ADDED,
          variables: { 
            cursor: data.games.pageInfo.endCursor, 
            numGames: data.games.edges.length, 
            bounds: props.bounds
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data.gameAdded) return prev;
            // if (subscriptionData.data.gameAdded.cursor > prev.games.pageInfo.endCursor) return prev
            const gameExists = prev.games.edges.filter(edge => {
              return edge.node.id === subscriptionData.data.gameAdded.node.id;
            }).length > 0;
            if (gameExists) return;
            let newGames = [subscriptionData.data.gameAdded, ...prev.games.edges];
            newGames = newGames.sort( (a,b) => {
            let comparison;
              if (parseInt(a.node.dateTime) > parseInt(b.node.dateTime)) {
                  comparison = 1;
              } else {
                  comparison = -1;
              }
              return comparison;
            })
            const newGameFeed = Object.assign({}, prev, { games: {
              edges: newGames, 
              pageInfo: {
                endCursor: prev.games.pageInfo.endCursor,
                hasNextPage: prev.games.pageInfo.hasNextPage,
                __typename: "PageInfo"
              }, 
              __typename: "GameFeed"
            }
            });
            return newGameFeed;
          }
        });
        subscribeToMore({
          document: GAME_DELETED,
          variables: {
            loadedGames: data.games.edges.map(g => g.node.id)
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data.gameDeleted) return prev;
            const newGameFeed = Object.assign({}, prev, { games: {
              edges: prev.games.edges.filter((value) => {
                return value.node.id !== subscriptionData.data.gameDeleted
              }), 
              pageInfo: {
                endCursor: prev.games.pageInfo.endCursor,
                hasNextPage: prev.games.pageInfo.hasNextPage,
                __typename: "PageInfo"
              }, 
              __typename: "GameFeed"
            }
            });
            return newGameFeed;
          }
        })
        }
      }
    /> 
    :
    <Loading/>
    }
    </>
  )
}

export default GameSource;