import Layout from '../components/Layout/Layout';

function About() {

    return (
        <React.Fragment>
            <Layout simple={true}>
                <br />
                <div className="about-container">
                    <div className="logo">
                        <img src="/REC-BOARD.png" />
                    </div>
                    <div className="about">
                        <p> Rec-board is an app meant for connecting people through sports and recreation. Our goal is to make it easier for people to coordinate games and to develop a medium that promotes people to play more with each other.</p>
                        <br />
                        <p className="design"> Simplicity and ease of use are our guiding design principles. Whether you want to use Rec-board to meet new players in your community or to coordinate private games with your friends, it only takes a few clicks and some planning. We hope that Rec-board can help you in those times where you want to play your favorite sport or game but don’t have enough people to play with.</p>
                    </div>
                    <br />
                    <br />
                    <br />
                    <p className="feedback"> If you would like to get involved in the Rec-board project, give feedback, or just talk about sports and community engagement we would love to hear from you – contact us at <a href="mailto:business@wworks.us">business@wworks.us</a>.</p>
                    <br />
                    <br />
                    <p className="donation"> Rec-board is free and only requires a phone number or Facebook account to use. Our goal is to eventually release a Rec-board mobile app for iOS and Android. Although never required any donations to this end would be greatly appreciated!</p>
                    <div className="paypal-donation">
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="CMPG9J3B99WEJ" />
                            <input type="hidden" name="item_name" value="For the Rec-Board Project" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                            <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                        </form>
                    </div>
                </div>
            </Layout>

            <style jsx>{`
                .about-container {
                    width: 1000px;
                    margin: 24px auto;
                    border-radius: 15px;
                    background-color: white;
                    padding: 32px 56px;
                    font-size: 1.2em;
                    animation: fadein 0.75s;
                }

                .logo {
                    display: inline-block;
                    height: 275px;
                    width: 250px;
                    
                }

                .logo > img {
                    width: 100%;
                    height: 100%;
                    border-radius: 15px;
                }

                .about {
                    display: inline-block;
                    width: 618px;
                    padding-left: 24px;
                    vertical-align: top;
                }

                .feedback {
                    font-weight: bold;
                    padding: 16px;
                    border: 6px solid var(--greyapple);
                }

                .donation {
                    font-style: italic;
                }

                .paypal-donation {
                    text-align: center;
                    margin: 12px 0;
                }

                @keyframes fadein {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media only screen and (max-width: 1024px) {
                    .about-container {
                        width: 750px;
                    }

                    .logo {
                        width: 125px;
                        height: 125px;
                    }

                    .about {
                        width: 500px;
                    }

                    .design { 
                        width: 600px;
                        margin-left: -150px;
                    }
                }

                @media only screen and (max-width: 700px) {
                    .about-container {
                        width: 100%;
                        padding: 12px;
                    }

                    .about {
                        display: block;
                        padding: 12px 0 0 0;
                        width: 100%;
                    }

                    .design {
                        margin: 0;
                        width: 100%;
                    }
                }
            `}</style>

        </React.Fragment>
    );
}

export default About;