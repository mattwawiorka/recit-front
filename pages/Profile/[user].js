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
            number
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
              image
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
    const debug = require('debug')('Profile');

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
        debug(error);
        router.push('/');
        alert("Could not find user");
        return <Loading />
    } 

    if (!data) {
        debug(error);
        router.push('/');
        alert("Could not find user");
        return <Loading />
    }

    const age = dateTool.getAge(data.user.node.dob);
    const joinDate = new Date(parseInt(data.user.node.createdAt));
    const joinString = dateTool.getMonth(joinDate.getMonth()) + " " + joinDate.getFullYear();
    
    const userPics = {
        pic1_small : data.user.node.pic1.split('.')[0] + '_SMALL.' + data.user.node.pic1.split('.')[1],
        pic1_large : data.user.node.pic1.split('.')[0] + '_LARGE.' + data.user.node.pic1.split('.')[1],
        pic2_small : data.user.node.pic2.split('.')[0] + '_SMALL.' + data.user.node.pic2.split('.')[1],
        pic2_large : data.user.node.pic2.split('.')[0] + '_LARGE.' + data.user.node.pic2.split('.')[1],
        pic3_small : data.user.node.pic3.split('.')[0] + '_SMALL.' + data.user.node.pic3.split('.')[1],
        pic3_large : data.user.node.pic3.split('.')[0] + '_LARGE.' + data.user.node.pic3.split('.')[1]
    };

    // If we are hosting the profile pic grab the appropriate size, otherwise use Facebooks
    if (data.user.node.profilePic.includes(process.env.API_URI)) {
        userPics.profile_medium = data.user.node.profilePic.split('.')[0] + '_MEDIUM.' + data.user.node.profilePic.split('.')[1];
        userPics.profile_large = data.user.node.profilePic.split('.')[0] + '_LARGE.' + data.user.node.profilePic.split('.')[1];
    } else {
        userPics.profile_medium = data.user.node.profilePic;
        userPics.profile_large = data.user.node.profilePic;
    }
    
    return (
        <Layout main={false} threeway={true} showLogout={data.user.isMe}>
            <br />
            <UserProfile 
                refetch={refetch} 
                owner={data.user.isMe} 
                user={data.user.node} 
                age={age} 
                joinDate={joinString} 
                userId={user} 
                userPics={userPics}
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