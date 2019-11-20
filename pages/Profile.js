import React, { Component } from 'react';
import Layout from '../components/Layout/Layout';
import UserProfile from '../components/UserProfile/UserProfile';
import MyProfile from '../components/UserProfile/MyProfile';
import MyGames from '../components/UserProfile/MyGames';
import FriendsList from '../components/UserProfile/FriendsList';
import Router from 'next/router';
import { withApollo } from '../lib/apollo';
import withAuth from '../lib/withAuth';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Loading from '../components/Loading/Loading';

const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
        id
        name
        createdAt
        age
        gender
        status
    }
  }
  `;

const ProfilePage = (props) => {
    const userId = Router.query.id;
    let profile;

    const { loading, error, data } = useQuery(GET_USER, {variables: {id: userId}});

    if (loading) return <Loading />
    if (error) return <h1>ERROR</h1>

    if (props.auth.getUser() === userId) {
        profile = <MyProfile user={data.user} userId={userId} /> 
    }
    else {
        profile = <UserProfile user={data.user} userId={userId} />
    }
    
    return (
        <Layout>
            <MyGames />
            {profile} 
            <FriendsList />
        </Layout>
    ) 
}

export default withApollo(withAuth(ProfilePage));