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

const SIGNUP = gql`
    mutation CreateUser($userInput: userInput) {
        createUserFb(userInput: $userInput) 
        {
            id
        }

        loginFb(userInput: $userInput) 
    }
`;

function Signup(props) {

    const [location, setLocation] = useState([47.7169839910907, -122.32040939782564]);
    const [userInput, setUserInput] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    const [createUser] = useMutation(SIGNUP);

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
            name: response.name,
            dob: response.birthday,
            gender: response.gender,
            loginLocation: location
        })
    }

    useEffect(() => {
        if (userInput) {
            createUser({ variables: { userInput: userInput } })
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
                    <h1>Create your Rec-it Account</h1>

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
                            textButton="Signup with Facebook"
                            callback={responseFacebook}
                        />
                        <p>By clicking "Sign up" you agree to our terms of service, privacy policy, and cookie policy</p>
                    </section>

                    <section className="signup-reasons">
                        <h2>Start Playing Today!</h2>
                        <p><i className="material-icons">calendar_today</i>Easily organize games with your friends</p>
                        <p><i className="material-icons">public</i>Engage with your community through public games</p>
                        <p><i className="material-icons">emoji_people</i>Find new players for your favorite sports and games</p>
                        <p><i className="material-icons">thumb_up</i>It's totally free</p>
                        <p className="learn-more">Learn more at our <Link href="/About"><a><u>About Page</u></a></Link></p>
                    </section>
        
                    <div className="login-link">
                        <p>Already have an Account? <Link href="/Login"><a><u>Log in!</u></a></Link></p>
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

                h1 {
                    margin-bottom: 1em;
                    font-weight: 200;
                    color: #0c0d0e;
                }

                section {
                    display: inline-block;
                    // border-radius: 4px;
                    // width: 50%;
                    // padding: 12px 20px;
                    
                }

                .signup-reasons {
                    width: 60%;
                    height: 300px;
                    padding-top: 25px;
                    text-align: left;
                }

                h2 {
                    text-align: center;
                    font-weight: 500;
                    margin-bottom: 0.5em;
                }

                .signup-reasons > p > i {
                    margin-right: 1em;
                    vertical-align: middle;
                }

                .signup-reasons > p {
                    padding-left: 100px;
                    line-height: 2.5em;
                    font-size: 1.1em;
                    // font-style: italic;
                }

                .learn-more {
                    margin-top: 0.2em;
                    color: #616770;
                }

                .signup-actions {
                    position: relative;
                    float: right;
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

export default withApollo(Signup);