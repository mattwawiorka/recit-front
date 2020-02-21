import Layout from '../components/Layout/Layout';

function About() {

    return (
        <React.Fragment>
            <Layout threeway={true}>
                <br />
                <div className="about-container">
                    <h1 style={{ textAlign: 'center', paddingTop: '25px' }}>About page</h1>
                </div>
            </Layout>

            <style jsx>{`
                .about-container {
                    animation: fadein 0.75s;
                }

                @keyframes fadein {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

        </React.Fragment>
    );
}

export default About;