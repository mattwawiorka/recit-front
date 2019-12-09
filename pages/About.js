import Layout from '../components/Layout/Layout';
import withAuth from '../lib/withAuth';

function About() {

    return (
        <Layout>
            <br />
            <div>
                <h1 style={{ textAlign: 'center', paddingTop: '25px' }}>About page</h1>
            </div>
            <br />
        </Layout>
    );
}

export default withAuth(About);