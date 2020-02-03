import Layout from '../../components/Layout/Layout';
import UserProfile from '../../components/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/apollo';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import Loading from '../../components/Loading/Loading';
import dateTool from '../../lib/dateTool';
import cookie from 'js-cookie';

const GET_USER = gql`
  query User($userId: ID!, $cursor: String, $pastGames: Boolean) {
    user(userId: $userId) {
        node {
            id
            name
            createdAt
            dob
            gender
            status
            profilePic
            pic1
            pic2
            pic3
            city
        }
        isMe
    }

    userGames(userId: $userId, cursor: $cursor, pastGames: $pastGames) {
        edges {
            node {
              id
              title
              sport
              dateTime
            }
            cursor
        }
        totalCount
        pageInfo {     
            endCursor
            hasNextPage
        }
    }

    topSport(userId: $userId)
    
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $userInput: userInput) {
    updateUser(userId: $userId, userInput: $userInput) {
        id
        status
    }
  }
`;

function ProfilePage(props) {

    const router = useRouter();

    if (!cookie.get('token')) {
        if (typeof window !== 'undefined') {
            router.push('/')
            router.replace('/','/profile/' + router.query.user)
        } else {
            return null
        }
    }

    const { user } = router.query;

    const { loading, error, data, refetch, fetchMore } = useQuery(GET_USER, 
        { variables: 
            { 
                userId: user,
                pastGames: true
            },
            skip: !cookie.get('token')
        }
    );
    const [updateProfile] = useMutation(UPDATE_USER);

    if (loading) return <Loading />
    if (error) {
        console.log(error)
        return <h1>ERROR</h1>
    } 

    if (!data) {
        router.push('/')
        router.replace('/','/profile/' + router.query.user)
        return null
    }

    const age = dateTool.getAge(data.user.node.dob);
    const joinDate = new Date(parseInt(data.user.node.createdAt));
    const joinString = dateTool.getMonth(joinDate.getMonth()) + " " + joinDate.getFullYear();
    
    return (
        <Layout main={false} showLogout={data.user.isMe}>
            <br />
            <UserProfile 
                refetch={refetch} 
                owner={data.user.isMe} 
                user={data.user.node} 
                age={age} 
                joinDate={joinString} 
                userId={user} 
                updateProfile={updateProfile}
                pastGames={data.userGames.edges}
                gamesPlayed={data.userGames.totalCount || 0}
                hasMore={data.userGames.pageInfo.hasNextPage || false}
                topSport={data.topSport}
                loadMore={() =>
                    fetchMore({
                        variables: { cursor: data.userGames.pageInfo.endCursor },
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
            /> 
            <br />
        </Layout>
    ) 
}

export default withApollo(ProfilePage);