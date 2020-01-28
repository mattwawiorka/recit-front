import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import GamesPrep from './GamesPrep';
import Loading from '../Loading/Loading';

const GET_GAMES = gql`
query Games($cursor: String, $sport: String, $startDate: String, $openSpots: String, $bounds: [Float], $sortOrder: String) {
  games(cursor: $cursor, sport: $sport, startDate: $startDate, openSpots: $openSpots, bounds: $bounds, sortOrder: $sortOrder) @connection(key: "GameFeed") {
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
    }
    pageInfo {     
      endCursor
      hasNextPage
    }
  }
}
`;

const MY_GAMES = gql`
  query MyGames($cursor: String) {
    userGames(cursor: $cursor) {
      edges {
        node {
          id
          title
          sport
          dateTime
        }
        role
      }
      totalCount
      pageInfo {     
        endCursor
        hasNextPage
      }
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

  const { data, loading, error, refetch, subscribeToMore, fetchMore } = useQuery(GET_GAMES, { variables: variables, ssr: true });
  const { data: data_myGames, loading: loading_myGames, fetchMore: fetchMore_myGames } = useQuery(MY_GAMES, { skip: !props.loggedIn });
  if (loading) return <Loading />
  if (loading_myGames) return <Loading />
  if (error) {
    console.log(error)
    return <p>Error</p>
  }

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
      myGames={data_myGames ? data_myGames.userGames.edges : []}
      activeCount={data_myGames ? data_myGames.userGames.totalCount : 0}
      hasMore_myGames={data_myGames ? data_myGames.userGames.pageInfo.hasNextPage : false}
      loadMore_myGames={() =>
        fetchMore_myGames({
          variables: { cursor: data_myGames.userGames.pageInfo.endCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.userGames.edges.length === 0) return prev;
            const newMyGameFeed = Object.assign({}, prev, { userGames: {
              edges: [...prev.userGames.edges, ...fetchMoreResult.userGames.edges], 
              totalCount: prev.userGames.totalCount,
              pageInfo: {
                endCursor: fetchMoreResult.userGames.pageInfo.endCursor,
                hasNextPage: fetchMoreResult.userGames.pageInfo.hasNextPage,
                __typename: "PageInfo"
              }, 
              __typename: "GameFeed"
            }
            });
            return newMyGameFeed
          }
        })
      }
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