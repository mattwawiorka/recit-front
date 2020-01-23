import React, { useState, useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery } from "react-apollo";
import Navigation from './Navigation';
import withAuth from '../../lib/withAuth';
import Loading from '../Loading/Loading';

const NOTIFICATIONS = gql`
    query {
        notifications
    }
`;

const NOTIFICATION_GAME = gql`
    subscription notifyGame($userId: ID) {
        notificationGame(userId: $userId) 
    }
`;

const NOTIFICATION_MESSAGE = gql`
    subscription notifyMessage($userId: ID) { 
        notificationMessage(userId: $userId)
    }
`;

function NotificationSource(props) {

    if (!props.auth.loggedIn()) {
        return <Navigation />
    }

    const { data, loading, error, refetch, subscribeToMore } = useQuery(NOTIFICATIONS, { skip: !props.auth.loggedIn });
    
    useEffect(() => {
        refetch();
    }, [])

    if (loading) return <Loading />
    if (error) {
        console.log(error)
        return <p>Error</p>
    }

    return (
        <Navigation
            unread={data.notifications}
            loggedIn={props.auth.loggedIn()}
            user={props.auth.getUser()}
            userName={props.auth.getUserName()}
            subscribeToNotifications={() => {
                subscribeToMore({
                    document: NOTIFICATION_GAME,
                    variables: {
                        userId: props.auth.getUser()
                    },
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData) return;
                        refetch();
                        return prev;
                    }
                }),
                subscribeToMore({
                    document: NOTIFICATION_MESSAGE,
                    variables: {
                        userId: props.auth.getUser()
                    },
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData) return;
                        refetch();
                        return prev;
                    }
                })
            }}
        />
    );
}

export default withAuth(NotificationSource);