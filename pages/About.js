import Layout from '../components/Layout/Layout';

function About() {

    return (
        <React.Fragment>
            <Layout threeway={true}>
                <br />
                <div className="about-container">
                    <p> Rec-it is an app meant for connecting people through sports and recreation. Our goal is to make it easier for people to coordinate games and to develop a medium that promotes people to play more with each other. We believe that real life social engagement and community involvement are crucial for well being and that most people could benefit from a medium in which to engage with those around them.</p>
                    <br />
                    <p> Simplicity and ease of use are our guiding design principles. Whether you want to use Rec-it to meet new players in your community or to coordinate private games with your friends, it only takes a few clicks and some planning. We hope that Rec-it can help you in those times where you want to play your favorite sport or game but don’t have enough people to play with.</p>
                    <br />
                    <p className="feedback"> If you would like to get involved in the Rec-it project, give feedback, or just talk about sports and community engagement we would love to hear from you – contact us at business@wworks.us.</p>
                    <br />
                    <p> Rec-it is free and only requires a phone number or Facebook account to use. Our goal is to eventually release a Rec-it mobile app for iOS and Android. Although never required any donations to this end would be greatly appreciated!</p>
                </div>
            </Layout>

            <style jsx>{`
                .about-container {
                    width: 90%;
                    height: calc(100vh - 50px);
                    margin: 0 auto;
                    // border-radius: 15px;
                    background-color: white;
                    padding: 64px 128px;
                    font-size: 1.2em;
                    animation: fadein 0.75s;
                }

                .feedback {
                    font-weight: bold;
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