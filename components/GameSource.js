import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import GamesPrep from './GamesPrep';
import Loading from './Loading/Loading';

const GET_GAMES = gql`
query Games($cursor: String) {
  games(cursor: $cursor) @connection(key: "GameFeed") {
    edges {
      node {
        id
        title
        sport
        venue
        dateTime
      }
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
      }
    }
  }
`;

function GameSource(props) {
  
  const { data, loading, error, refetch, subscribeToMore, fetchMore } = useQuery(GET_GAMES, {ssr: "false"});
  if (loading) return <Loading />
  if (error) return <p>Error</p>

  return (
    <>
    {typeof props.loggedIn !== 'undefined' ?
    <GamesPrep
      games={data.games.edges || []} 
      hasMore={data.games.pageInfo.hasNextPage}
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
      loggedIn={props.loggedIn} 
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