import gql from "graphql-tag";
import { useQuery, useMutation } from '@apollo/react-hooks';
import CommentList from './CommentList';
import Loading from '../Loading/Loading';
import InputBox from './InputBox';


const GET_COMMENTS = gql`
    query Comments($conversationId: ID!, $cursor: String) {
        messages(conversationId: $conversationId, cursor: $cursor) {
            edges {
                node {
                    id
                    author
                    userId
                    content
                    dateTime
                }
                cursor
                isOwner
            }
            pageInfo {     
                endCursor
                hasNextPage
            }
        }
    }
`;

const CREATE_COMMENT = gql`
    mutation CreateComment($messageInput: messageInput) {
        createMessage(messageInput: $messageInput) {
            id
        }
    }
`;

const UPDATE_COMMENT = gql`
    mutation UpdateComment($id: ID!, $content: String!) {
        updateMessage(id: $id, content: $content) {
            id
        }
    }
`;

const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteMessage(id: $id) {
            id
        }
    }
`;

const COMMENT_ADDED = gql`
    subscription onCommentAdded($conversationId: ID!) {
        messageAdded(conversationId: $conversationId) {
            node {
                id
                author
                content
                dateTime 
                userId 
            }
            cursor
            isOwner
        }
    }
`;

const COMMENT_UPDATED = gql`
    subscription onCommentUpdated($conversationId: ID!) {
        messageUpdated(conversationId: $conversationId) {
            node {
                id
                content
            }
        }
    }
`;

const COMMENT_DELETED = gql`
    subscription onCommentDeleted($conversationId: ID!) {
        messageDeleted(conversationId: $conversationId) {
            node {
                id
            }
        }
    }
`;

function Discussion(props) {
    
    const { data, loading, error, fetchMore, subscribeToMore } = useQuery(GET_COMMENTS, { variables: { conversationId: props.conversationId }, ssr: true });
    const [createComment] = useMutation(CREATE_COMMENT);
    const [updateComment] = useMutation(UPDATE_COMMENT);
    const [deleteComment] = useMutation(
        DELETE_COMMENT,
        {
            update(cache, { data: { deleteMessage } }) {
                const { messages } = cache.readQuery({ query: GET_COMMENTS, variables: { conversationId: props.conversationId } });
                const newEdges = messages.edges.filter((value) => {
                    return value.node.id !== deleteMessage.id
                });
                messages.edges = newEdges;
                cache.writeQuery({
                    query: GET_COMMENTS,
                    data: messages
                })
            }
        }
    );
    if (loading) return <Loading />
    if (error) return <h4>ERROR!!!</h4>

    console.log(data)

    return (
        <React.Fragment>
            <div className="discussion-container">
                <h3 className="title">Discussion</h3>

                <InputBox conversationId={props.conversationId} createComment={createComment} currentUser={props.currentUser} />

                <CommentList 
                    comments={data.messages.edges}
                    updateComment={updateComment} 
                    deleteComment={deleteComment}
                    hasMore={data.messages.pageInfo.hasNextPage}
                    loadMore={() => 
                        fetchMore({
                          variables: {cursor: data.messages.pageInfo.endCursor},
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (fetchMoreResult.messages.edges.length === 0) return prev;
                            const newMessageFeed = Object.assign({}, prev, { messages: {
                              edges: [...prev.messages.edges, ...fetchMoreResult.messages.edges], 
                              pageInfo: {
                                endCursor: fetchMoreResult.messages.pageInfo.endCursor,
                                hasNextPage: fetchMoreResult.messages.pageInfo.hasNextPage,
                                __typename: "PageInfo"
                              }, 
                              __typename: "MessageFeed"
                            }
                            });
                            return newMessageFeed
                          }
                        })
                      }
                    subscribeToMore={() => {
                        subscribeToMore({
                            document: COMMENT_ADDED,
                            variables: {conversationId: props.conversationId},
                            updateQuery: (prev, { subscriptionData }) => {
                                if (!subscriptionData.data.messageAdded) return prev;
                                const newComment = subscriptionData.data.messageAdded;
                                const newComments = Object.assign({}, prev, { messages: {
                                    edges: [newComment, ...prev.messages.edges],
                                    pageInfo: {
                                        endCursor: prev.messages.pageInfo.endCursor,
                                        hasNextPage: prev.messages.pageInfo.hasNextPage,
                                        __typename: "PageInfo"
                                    }, 
                                    __typename: "MessageFeed"
                                    }
                                });
                                return newComments
                            }
                        });
                        subscribeToMore({
                            document: COMMENT_UPDATED,
                            variables: {conversationId: props.conversationId},
                            updateQuery: (prev, { subscriptionData }) => {
                                if (!subscriptionData.data.messageAdded) return prev;
                                const newComments = Object.assign({}, prev, { messages: {
                                    edges: [newComment, ...prev.messages.edges],
                                    pageInfo: {
                                        endCursor: prev.messages.pageInfo.endCursor,
                                        hasNextPage: prev.messages.pageInfo.hasNextPage,
                                        __typename: "PageInfo"
                                    }, 
                                    __typename: "MessageFeed"
                                    }
                                });
                                return newComments
                            }
                        });
                        subscribeToMore({
                            document: COMMENT_DELETED,
                            variables: {conversationId: props.conversationId},
                            updateQuery: (prev, { subscriptionData }) => {
                                if (!subscriptionData.data.messageDeleted) return prev;
                                const newComments = Object.assign({}, prev, { messages: {
                                    edges: prev.messages.edges.filter((value) => {
                                        return value.node.id !== subscriptionData.data.messageDeleted.node.id
                                    }),
                                    pageInfo: {
                                        endCursor: prev.messages.pageInfo.endCursor,
                                        hasNextPage: prev.messages.pageInfo.hasNextPage,
                                        __typename: "PageInfo"
                                    }, 
                                    __typename: "MessageFeed"
                                    }
                                });
                                return newComments
                            }
                        });
                    }} 
                    currentUser={props.currentUser} 
                 conversationId={props.conversationId} 
                />
            </div>

            <style jsx>{`
                .discussion-container {
                    display: block;
                    padding: 0% 10% 0% 10%;
                    margin-bottom: 4em;
                }

                .title {
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.5em;
                    margin-bottom: 0.5em;
                }

            `}</style>
        </React.Fragment>
    );
}

export default Discussion;