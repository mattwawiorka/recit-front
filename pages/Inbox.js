import { useEffect, useState } from 'react';
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { withApollo } from '../lib/apollo';
import Loading from "../components/Loading/Loading";
import Link from 'next/link';
import Layout from '../components/Layout/Layout';
import dateTool from '../lib/dateTool';
import classNames from 'classnames';

const INBOX = gql`
    query Inbox {
        inbox {
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
                    updatedAt
                }
            }
        }
    } 
`;

function Inbox(props) {
    let threads = [];

    const [waiting, setWaiting] = useState(true);

    const { data, loading, error, refetch } = useQuery(INBOX);
    

    useEffect(() => {
        refetch();

        setWaiting(false);
    }, [])

    if (loading) return <Loading />
    if (error) {
        console.log(error)
        return <p>Error</p>
    }

    console.log(data)

    const threadStyle = 
        <style jsx="true">{`
            .thread {
                display: block;
                font-size: 1.5em;
                cursor: pointer;
                margin-bottom: 0.5em;
                color: #616770;
            }

            .isNew {
                // background-color: orange;
                color: black;
                border-radius: 5px;
            }

            .thread:hover {
                cursor: pointer;
                // transform: scale(0.95);
                background-color: var(--greyapple);
            }

            .thread-heading {
                display: inline-block;
                width: 30%;
                border-right: 2px solid var(--greyapple);
            }

            .date-time {
                color: #616770;
                font-size: 0.7em;
                font-style: italic;
            }

            .thread-content {
                display: inline-block;
                width: 70%;
                padding-left: 0.5em;
                vertical-align: top;
                overflow: hidden;
            }
        `}</style>

    data.inbox.edges.map( thread => {

        const threadClass = classNames({
            'thread': true,
            'isNew': thread.isNew
        });

        if (thread.forGame && thread.node.type === 3) {
            threads.push(
                <React.Fragment key={thread.node.id}>
                    <Link href='/Game/[game]' as={`/Game/${thread.node.gameId}`} shallow={true} >
                        <div className={threadClass}>
                            <span className="thread-heading">
                                <div>
                                    {thread.conversation}
                                </div>
                                <div className="date-time">
                                    {dateTool.getDateTime(parseInt(thread.node.updatedAt))} 
                                </div>
                            </span>
                            <span className="thread-content">{thread.node.content.slice(0,7) + " by " + thread.node.author}</span>
                        </div>
                    </Link>
                    {threadStyle}
                </React.Fragment>
            );
        } 
        else if (thread.forGame && thread.node.type === 4) {
            threads.push(
                <React.Fragment key={thread.node.id}>
                    <Link href='/Game/[game]' as={`/Game/${thread.node.gameId}`} shallow={true} >
                        <div className={threadClass}>
                            <span className="thread-heading">
                                <div>
                                    {thread.conversation}
                                </div>
                                <div className="date-time">
                                    {dateTool.getDateTime(parseInt(thread.node.updatedAt))} 
                                </div>
                            </span>
                            <span className="thread-content">{thread.node.author + " " + thread.node.content}</span>
                        </div>
                    </Link>
                    {threadStyle}
                </React.Fragment>
            );
        } 
        else if (thread.forGame) {
            threads.push(
                <React.Fragment key={thread.node.id}>
                    <Link href='/Game/[game]' as={`/Game/${thread.node.gameId}`} shallow={true} >
                        <div className={threadClass}>
                            <span className="thread-heading">
                                <div>
                                    {thread.conversation}
                                </div>
                                <div className="date-time">
                                    {dateTool.getDateTime(parseInt(thread.node.updatedAt))} 
                                </div>
                            </span>
                            <span className="thread-content">{thread.node.author + ": " + thread.node.content}</span>
                        </div>
                    </Link>
                    {threadStyle}
                </React.Fragment>
            );
        } 
    });

    if (waiting) return <Loading />

    return (
        <React.Fragment>
            <Layout main={false}>
                <br />
                <div className="inbox-container">
                    <h1 className="inbox-heading">Conversations</h1>
                    <div>{threads}</div>
                </div>
                <br />
            </Layout>

            <style jsx>{`
                .inbox-container {
                    width: 75%;
                    margin-top: 2em;
                    transform: translate(-50%);
                    margin-left: 50%;
                    background: white;
                    padding: 1em;
                    padding-top: 0.5em;
                    border-radius: 15px;
                    border-bottom-style: groove;
                }

                .inbox-heading {
                    margin-bottom: 0.5em;
                }
            `}</style>
        </React.Fragment>
    )
}

export default withApollo(Inbox);