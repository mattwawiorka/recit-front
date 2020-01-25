import Layout from '../../components/Layout/Layout';
import UserProfile from '../../components/UserProfile/UserProfile';
import MyGames from '../../components/UserProfile/MyGames';
import FriendsList from '../../components/UserProfile/FriendsList';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/apollo';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Loading from '../../components/Loading/Loading';
import withAuth from '../../lib/withAuth';
import dateTool from '../../lib/dateTool';

const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
        id
        name
        createdAt
        dob
        gender
        status
        profilePic
        city
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

    let profile;

    const { loading, error, data, refetch } = useQuery(GET_USER, {variables: {id: user}});

    if (loading) return <Loading />
    if (error) return <h1>ERROR</h1>

    const age = dateTool.getAge(data.user.dob);
    const joinDate = new Date(parseInt(data.user.createdAt));
    const joinString = dateTool.getMonth(joinDate.getMonth()) + " " + joinDate.getFullYear();
    
    return (
        <Layout main={false} showLogout={props.auth.getUser() === user}>
            <MyGames />
            <UserProfile refetch={refetch} owner={props.auth.getUser() === user} user={data.user} age={age} joinDate={joinString} userId={user} token={props.auth.getToken()} /> 
            <FriendsList />
        </Layout>
    ) 
}

export default withApollo(withAuth(ProfilePage));