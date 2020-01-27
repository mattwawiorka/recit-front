import Layout from '../../components/Layout/Layout';
import UserProfile from '../../components/UserProfile/UserProfile';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/apollo';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Loading from '../../components/Loading/Loading';
import withAuth from '../../lib/withAuth';
import dateTool from '../../lib/dateTool';

const GET_USER = gql`
  query User($userId: ID!, $pastGames: Boolean) {
    user(userId: $userId) {
        id
        name
        createdAt
        dob
        gender
        status
        profilePic
        city
    }

    userGames(userId: $userId, pastGames: $pastGames) {
        edges {
            node {
              id
              title
              sport
              dateTime
            }
            cursor
        }
        pageInfo {     
            endCursor
            hasNextPage
        }
    }
    
  }
  `;

function ProfilePage(props) {

    const router = useRouter();

    if (!props.auth.loggedIn()) {
        if (typeof window !== 'undefined') router.push('/')
        return null
    }

    const { user } = router.query;

    const { loading, error, data, refetch } = useQuery(GET_USER, 
        { variables: 
            { 
                userId: user,
                pastGames: true
            }
        }
    );

    if (loading) return <Loading />
    if (error) return <h1>ERROR</h1>

    console.log(data)

    const age = dateTool.getAge(data.user.dob);
    const joinDate = new Date(parseInt(data.user.createdAt));
    const joinString = dateTool.getMonth(joinDate.getMonth()) + " " + joinDate.getFullYear();
    
    return (
        <Layout main={false} showLogout={props.auth.getUser() === user}>
            <br />
            <UserProfile 
                refetch={refetch} 
                owner={props.auth.getUser() === user} 
                user={data.user} age={age} 
                joinDate={joinString} 
                userId={user} 
                token={props.auth.getToken()} 
            /> 
            <br />
        </Layout>
    ) 
}

export default withApollo(withAuth(ProfilePage));