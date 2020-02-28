import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from "react-apollo";
import Navigation from './Navigation';
import Loading from '../Loading/Loading';
import cookie from 'js-cookie';

const NOTIFICATIONS = gql`
    query {
        notifications

        whoAmI {
            id
            name
            profilePic
        }
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
    const debug = require('debug')('NotificationSource');

    if (!cookie.get('token')) {
        return <Navigation />
    }

    const { data, loading, error, refetch, subscribeToMore } = useQuery(NOTIFICATIONS, { skip: !cookie.get('token') });
    
    useEffect(() => {
        refetch();
    }, [])

    if (loading) return <Loading />

    if (error) {
        debug(error);
        return <Navigation />
    }

    if (!data.whoAmI) {
        return <Navigation />
    }

    return (
        <Navigation
            unread={data.notifications}
            user={data.whoAmI.id}
            userName={data.whoAmI.name}
            showLogout={props.showLogout}
            logout={() => cookie.remove('token')}
            subscribeToNotifications={() => {
                if (data.whoAmI.id) {
                    subscribeToMore({
                        document: NOTIFICATION_GAME,
                        variables: {
                            userId: data.whoAmI.id
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
                            userId: data.whoAmI.id
                        },
                        updateQuery: (prev, { subscriptionData }) => {
                            if (!subscriptionData) return;
                            refetch();
                            return prev;
                        }
                    })
                }
            }}
        />
    );
}

export default NotificationSource;