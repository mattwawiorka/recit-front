import { useEffect, useState, useRef, useCallback } from 'react';
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { withApollo } from '../lib/apollo';
import Loading from "../components/Loading/Loading";
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import Conversation from '../components/Inbox/Conversation';
import ConversationList from '../components/Inbox/ConversationList';

const INBOX = gql`
    query Inbox($cursor: String) {
        inbox(cursor: $cursor) {
            edges {
                conversation
                forGame
                isNew
                node {
                    id
                    author
                    content
                    type
                    gameId
                    conversationId
                    createdAt
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    } 
`;

function Inbox(props) {
    const debug = require('debug')('Inbox');
    
    let conversations = [];

    const [waiting, setWaiting] = useState(true);

    const router = useRouter();

    if (!cookie.get('token')) {
        if (typeof window !== 'undefined') {
            router.push('/');
            router.replace('/','/Inbox');
        }

        return null
    }

    const { data, loading, error, refetch, fetchMore } = useQuery(INBOX);

    useEffect(() => {
        refetch();

        setWaiting(false);
    }, [])

    const observer = useRef();
    const lastConversation = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {    
                observer.current.disconnect();
                if (data.inbox.pageInfo.hasMore) {
                    fetchMore({ variables: { cursor: data.inbox.pageInfo.endCursor }})
                } 
            }
        })
        if (node) observer.current.observe(node)
    }, [data])

    if (loading) return <Loading />
    if (error) {
        debug(error);
        return <Loading />
    }

    if (waiting) return <Loading />

    data.inbox.edges.map( (conversation, index) => {
        if (data.inbox.edges.length === index + 1) {
            conversations.push(
                <React.Fragment key={conversation.node.id}>
                    <Conversation conversation={conversation} />

                    <div className="custom-border" ref={lastConversation} />
                    
                    <style jsx>{`
                        .custom-border {
                            width: 75%;
                            margin: 0 auto;
                            float: left;
                            border: 2px solid var(--greyapple);
                        }
                    `}</style>
                </React.Fragment>
            );
        } else {
            conversations.push(
                <React.Fragment key={conversation.node.id}>
                    <Conversation conversation={conversation} />

                    <div className="custom-border" />
                    
                    <style jsx>{`
                        .custom-border {
                            width: 75%;
                            margin: 0 auto;
                            float: left;
                            border: 2px solid var(--greyapple);
                        }
                    `}</style>
                </React.Fragment>
            );
        }
    });

    return <ConversationList conversations={conversations} />
}

export default withApollo(Inbox);