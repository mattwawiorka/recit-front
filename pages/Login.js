import Layout from '../components/Layout/Layout';
import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import MaskedInput from 'react-text-mask';
import Link from 'next/link';
import { useMutation } from 'react-apollo'
import { withApollo } from '../lib/apollo';
import gql from 'graphql-tag';
import cookie from 'js-cookie';
import FacebookLogin from 'react-facebook-login';

const LOGIN_FB = gql`
    mutation Login($userInput: userInput) {
        loginFb(userInput: $userInput) 
    }
`;

const SEND_SMS = gql`
    mutation LoginPhone($phoneNumber: String!) {
        loginPhone(phoneNumber: $phoneNumber) 
    }
`;

const LOGIN_PHONE = gql`
    mutation VerifyUserPhone($userInput: userInput) {
        verifyUserPhone(userInput: $userInput) 
    }
`;

function Login(props) {
    const debug = require('debug')('Login');

    const [location, setLocation] = useState([47.621354, -122.333289]);
    const [userInput, setUserInput] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneCode, setPhoneCode] = useState(null);
    const [smsSent, setSMSSent] = useState(false);
    const [errors, setErrors] = useState([]);

    let errorDisplay= [];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    const [loginUserFb] = useMutation(LOGIN_FB);
    const [sendSMS] = useMutation(SEND_SMS);
    const [loginPhone] = useMutation(LOGIN_PHONE);

    errors.map( (error, index) => {
        errorDisplay.push(
            <li key={index}>
                {error.message}
            </li>
        );
    });

    const responseFacebook = useCallback((response) => {
        if (!response) return;
        setUserInput({
            facebookId: response.id,
            facebookToken: response.accessToken,
            loginLocation: location
        })
    }, []);

    useEffect(() => {
        if (!userInput) {
            return; 
        }
        else if (userInput.facebookToken) {
            loginUserFb({ variables: { userInput: userInput } })
            .then(response => {
                if (response.errors) {
                    debug(response);
                    setErrors(response.errors);
                    return;
                }
                else if (response.data.loginFb) {
                    // Login Token expires in 60 days, this is to coincide with FB permissions needing refresh
                    cookie.set('token', response.data.loginFb, { expires: 60 });
                    Router.push('/');
                }
            }) 
        }
        else if (userInput.phoneCode) {
            loginPhone({ variables: { userInput: userInput } })
            .then(response => {
                if (response.errors) {
                    debug(response);
                    setErrors(response.errors);
                    return;
                }
                else if (response.data.verifyUserPhone) {
                    cookie.set('token', response.data.verifyUserPhone, { expires: 60 })
                    Router.push('/');
                }
            }) 
        }
    }, [userInput])

    return (
        <React.Fragment>
            <Layout simple={true}>
                <br />

                <div className="login-container">

                    <span className="alert">
                        {errorDisplay}
                    </span>

                    <section className="login-actions">
                    {!smsSent ?
                        <React.Fragment>
                            <FacebookLogin
                                appId={process.env.FACEBOOK_KEY}
                                autoLoad={true}
                                scope="public_profile, email, user_birthday, user_gender"
                                fields="name, email, picture, birthday, gender"
                                icon="fa fa-facebook-square"
                                textButton="Log in with Facebook"
                                callback={responseFacebook}
                            />

                            <div className="form-group phone-number">
                                <label className="text-muted title">Phone Number</label>
                                <MaskedInput 
                                    mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    style={{ width: '100%', padding: '12px 20px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                                    guide={false}
                                    onChange={(e) => {
                                        let number = e.target.value.replace('(','');
                                        number = number.replace(')','');
                                        number = number.replace('-','');
                                        number = number.replace(' ','');
                                        setPhoneNumber(number);
                                    }}
                                    placeholder="(123) 123-1234"
                                />
                            </div>

                            {phoneNumber.length === 10 ?
                            <button 
                                className="form-button"
                                onClick={() => {
                                    sendSMS({ variables: { phoneNumber: phoneNumber }  })
                                    .then(response => {
                                        if (response.errors) {
                                            setErrors(response.errors)
                                            return;
                                        }
                                        else if (response.data.loginPhone) {
                                            setSMSSent(true);
                                        }
                                    })
                                }}
                            >Send SMS Code</button>
                            :
                            null}
                        </React.Fragment>
                        :
                        <div className="sms-form">
                            <div className="form-group phone-number">
                                <label className="text-muted">SMS Code</label>
                                <input 
                                    onChange={(e) => setPhoneCode(e.target.value)} 
                                    type="text" 
                                    className="input-fields"
                                    placeholder="Verify your phone number"
                                />
                            </div>

                            <button 
                                className="form-button"
                                onClick={() => {
                                    setUserInput({
                                        phoneNumber: phoneNumber,
                                        phoneCode: (isNaN(phoneCode) || phoneCode.toString().length > 9) ? 1 : parseInt(phoneCode),
                                        loginLocation: location
                                    });
                                }}
                            >LOG IN</button>
                        </div>
                        }
                    </section>
        
                    <div className="login-link">
                        <p>New to Rec-Board? <Link href="/Signup"><a><u>Signup Today!</u></a></Link></p>
                    </div> 
                </div>

                <br />
            </Layout>

            <style jsx>{`
                .login-container {
                    display: block;
                    // width: 100%;
                    margin: 0 auto;
                    // margin: auto;
                    margin-top: 32px;
                    text-align: center;
                    animation: fadein 0.75s;
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

                h2 {
                    text-align: center;
                    font-weight: 500;
                    margin-bottom: 0.5em;
                }

                i {
                    margin-right: 1em;
                    vertical-align: middle;
                }

                .login-actions {
                    position: relative;
                    width: 420px;
                    height: 300px;
                    padding: 12px;
                    padding-top: 20px;
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.1);
                }

                .text-muted {
                    float: left;
                    font-size: 1.2em;
                }

                .input-fields {
                    width: 100%; 
                    padding: 12px 20px;
                    margin: 8px 0; 
                    border: 1px solid #ccc; 
                    borderRadius: 4px;
                }

                .input-error {
                    border-color: red;
                }

                .signup-actions > p {
                    position: absolute;
                    bottom: 10px;
                    font-size: 0.9em;
                    color: #616770;
                }

                .form-button {
                    display: block;
                    width: 300px;
                    height: 32px;
                    position: absolute;
                    bottom: 24px;
                    margin: 0 60px;
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                .sms-form { 
                    position: absolute;
                    bottom: 80px;
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }

                .phone-number { 
                    position: absolute;
                    bottom: 64px;
                    display: block;
                    width: 300px;
                    margin: 0 60px;
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

                @media only screen and (max-width: 420px) {
                    .login-actions {
                        width: 100%;
                    }

                    .phone-number { 
                        width: 90%;
                        margin: 0;
                    }
                }

                @media only screen and (max-height: 375px) {
                    .login-container { 
                        margin-top: 12px;
                    }

                    .login-actions {
                        height: 250px;
                        padding-top: 20px;
                    }
                }
            `}</style>      
        </React.Fragment>
    );
}

export default withApollo(Login);