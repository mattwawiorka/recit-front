import Layout from '../components/Layout/Layout';
import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import MaskedInput from 'react-text-mask';
import Link from 'next/link';
import { useMutation } from 'react-apollo'
import { withApollo } from '../lib/apollo';
import gql from 'graphql-tag';
import cookie from 'js-cookie';
import API from '../api.json';
import FacebookLogin from 'react-facebook-login';

const SIGNIN = gql`
    mutation Login($userInput: userInput) {
        loginFb(userInput: $userInput) 
    }
`;

function Login(props) {

    const [location, setLocation] = useState([47.7169839910907, -122.32040939782564]);
    const [userInput, setUserInput] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    const [loginUser] = useMutation(SIGNIN);

    // errors.map( (error, index) => {
    //     errors.push(
    //         <li key={index}>
    //             {error.message}
    //         </li>
    //     );
    // });

    const responseFacebook = (response) => {
        setUserInput({
            facebookId: response.id,
            facebookToken: response.accessToken,
            loginLocation: location
        })
    }

    useEffect(() => {
        if (userInput) {
            loginUser({ variables: { userInput: userInput } })
            .then(response => {
                if (response.errors) {
                    setErrors(response.errors[0].data)
                    return;
                }
                cookie.set('token', response.data.loginFb, { expires: 1 })
                if (Router.query.invited) {
                    Router.push('/Game/[game]', `/Game/${Router.query.game}`);
                } else {
                    Router.push('/');
                } 
            }) 
        }
    }, [userInput])

    return (
        <React.Fragment>
            <Layout>
                <br />

                <div className="signup-container">

                    {/* <span 
                        className="alert"
                        style={{ display: (this.state.errors[0].message !== "") ? "" : "none" }}
                    >
                        {errors}
                    </span> */}

                    <section className="signup-actions">
                        <FacebookLogin
                            appId={API.facebook}
                            autoLoad={false}
                            scope="public_profile, email, user_birthday, user_gender"
                            fields="name, email, picture, birthday, gender"
                            icon="fa fa-facebook-square"
                            textButton="Login with Facebook"
                            callback={responseFacebook}
                        />
                    </section>
        
                    <div className="login-link">
                        <p>New to Rec-it? <Link href="/Signup"><a><u>Signup Today!</u></a></Link></p>
                    </div> 
                </div>

                <br />
            </Layout>

            <style jsx>{`
                .signup-container {
                    display: block;
                    width: 90%;
                    margin: auto;
                    margin-top: 2em;
                    text-align: center;
                    // border: 1px solid #ccc;
                    // border-radius: 4px;
                }

                a > u {
                    // font-weight: bold;
                    font-size: 1.1em;
                    color: var(--greenapple);
                }

                section {
                    display: inline-block; 
                }

                .learn-more {
                    margin-top: 0.2em;
                    color: #616770;
                }

                .signup-actions {
                    position: relative;
                    width: 40%;
                    height: 200px;
                    padding: 12px;
                    padding-top: 20px;
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.1);
                }

                .signup-actions > p {
                    position: absolute;
                    bottom: 10px;
                    font-size: 0.9em;
                    color: #616770;
                }

                .login-link {
                    display: block;
                    width: 100%;
                    text-align: center;
                    margin-top: 1.5em;
                    font-size: 1.2em;
                }

                .alert {
                    color: black;
                    margin-bottom: 15px;
                    text-align: center;
                }

                @media only screen and (max-width: 700px) {
                    .container {
                        grid-template-columns: .25fr 1fr .25fr;
                    }
                }
            `}</style>      
        </React.Fragment>
    );
}

export default withApollo(Login);