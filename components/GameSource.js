import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import GamesPrep from './GamesPrep';
import Loading from './Loading/Loading';

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
}
`;

const GAME_ADDED = gql`
  subscription {
    gameAdded {
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
      }
    }
  }
`;

function GameSource(props) {

  console.log(props)
  
  let variables = {
    currentLoc: props.currentLoc,
    sport: props.sport,
    startDate: props.startDate,
    openSpots: props.openSpots,
    bounds: props.bounds,
    sortOrder: props.sortOrder
  };

  useEffect(() => {
    console.log('use effect')
    refetch();
  }, [props.sport, props.startDate, props.bounds, props.sortOrder, props.openSpots])

  const { data, loading, error, refetch, subscribeToMore, fetchMore } = useQuery(GET_GAMES, {variables: variables, ssr: "false"});
  if (loading) return <Loading />
  if (error) return <p>Error</p>

  console.log(data)

  return (
    <>
    {typeof props.loggedIn !== 'undefined' ?
    <GamesPrep
      loggedIn={props.loggedIn} 
      currentLoc={props.currentLoc}
      getMapBounds={props.getMapBounds}
      games={data.games.edges || []} 
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
      refetch={refetch}
      subscribeToGames={() => 
        subscribeToMore({
          document: GAME_ADDED,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data.gameAdded) return prev;
            if (subscriptionData.data.gameAdded.cursor > prev.games.pageInfo.endCursor) return prev
            const gameExists = prev.games.edges.filter(edge => {
              return edge.node.id === subscriptionData.data.gameAdded.id;
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
        })
      }
      /> 
      :
      <Loading/>
      }
      </>
  )
}

export default GameSource;