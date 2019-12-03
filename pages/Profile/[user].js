import Layout from '../../components/Layout/Layout';
import UserProfile from '../../components/UserProfile/UserProfile';
import MyProfile from '../../components/UserProfile/MyProfile';
import MyGames from '../../components/UserProfile/MyGames';
import FriendsList from '../../components/UserProfile/FriendsList';
import { useRouter } from 'next/router';
import { withApollo } from '../../lib/apollo';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Loading from '../../components/Loading/Loading';
import { useContext } from 'react';
import AuthContext from '../../lib/AuthContext';

const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
        id
        name
        createdAt
        age
        gender
        status
    }
  }
  `;

const ProfilePage = (props) => {
    const auth = useContext(AuthContext);

    const router = useRouter();

    if (!auth.loggedIn) {
        if (typeof window !== 'undefined') router.push('/')
        return null
    }

    const { user } = router.query;

    let profile;

    const { loading, error, data } = useQuery(GET_USER, {variables: {id: user}});

    if (loading) return <Loading />
    if (error) return <h1>ERROR</h1>

    if (auth.user === user) {
        profile = <MyProfile user={data.user} userId={user} /> 
    }
    else {
        profile = <UserProfile user={data.user} userId={user} />
    }
    
    return (
        <Layout main={true} >
            <MyGames />
            {profile} 
            <FriendsList />
        </Layout>
    ) 
}

export default withApollo(ProfilePage);