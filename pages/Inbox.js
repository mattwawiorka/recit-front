import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { withApollo } from '../lib/apollo';
import Loading from "../components/Loading/Loading";
import Link from 'next/link';

const INBOX = gql`
    query Inbox {
        inbox {
            edges {
                node {
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

    const { data, loading, error } = useQuery(INBOX);
    if (loading) return <Loading />
    if (error) {
        console.log(error)
        return <p>Error</p>
    }

    console.log(data)
    data.inbox.edges.map( thread => {
        console.log(thread)
        if (thread.node.gameId) {
            threads.push(
                <Link href='/Game/[game]' as={`/Game/${thread.node.gameId}`} shallow={true} >
                    <a>{thread.node.author + " invited you to a game!"}</a>
                </Link>
            )
        } else {
            threads.push(thread.node.content)
        }
        
    })

    return (
        <React.Fragment>
        
            <h1>My Messages</h1>
            <div>{threads}</div>

        </React.Fragment>
    )
}

export default withApollo(Inbox);