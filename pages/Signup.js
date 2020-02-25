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
import classNames from 'classnames';


const SIGNUP_FB = gql`
    mutation CreateUserFb($userInput: userInput) {
        createUserFb(userInput: $userInput) 
    }
`;

const LOGIN_FB = gql`
    mutation CreateUserFb($userInput: userInput) {
        loginFb(userInput: $userInput) 
}
`;

const SEND_SMS = gql`
    mutation CreateUserPhone($phoneNumber: String!) {
        createUserPhone(phoneNumber: $phoneNumber) 
    }
`;

const SIGNUP_PHONE = gql`
    mutation VerifyUserPhone($userInput: userInput) {
        verifyUserPhone(userInput: $userInput) 
    }
`;

function Signup(props) {

    const [location, setLocation] = useState([47.621354, -122.333289]);
    const [userInput, setUserInput] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [dob, setDOB] = useState(null);
    const [gender, setGender] = useState("female");
    const [phoneCode, setPhoneCode] = useState(null);
    const [smsSent, setSMSSent] = useState(false);
    const [errors, setErrors] = useState([]);

    let errorDisplay= [];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    const [signupFb] = useMutation(SIGNUP_FB);
    const [loginFb] = useMutation(LOGIN_FB);
    const [sendSMS] = useMutation(SEND_SMS);
    const [signupPhone] = useMutation(SIGNUP_PHONE);

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
            name: response.name,
            dob: response.birthday,
            gender: response.gender,
            loginLocation: location
        })
    });

    useEffect(() => {
        if (!userInput) {
            return; 
        }
        else if (userInput.facebookToken) {
            signupFb({ variables: { userInput: userInput } })
            .then(response => {
                if (response.errors) {
                    setErrors(response.errors)
                    return;
                }
                else if (response.data.createUserFb) {
                    loginFb({ variables: { userInput: userInput } })
                    .then(response => {
                        if (response.data.loginFb) {
                            cookie.set('token', response.data.loginFb, { expires: 1 })
                            Router.push('/');
                        }
                    })
                } 
            }) 
        } 
        else if (userInput.phoneCode) {
            signupPhone({ variables: { userInput: userInput } })
            .then(response => {
                console.log(response)
                if (response.errors) {
                    setErrors(response.errors)
                    return;
                }
                else if (response.data.verifyUserPhone) {
                    cookie.set('token', response.data.verifyUserPhone, { expires: 1 })
                    Router.push('/');
                }
            }) 
        }
    }, [userInput])

    const inputClass = classNames({
        "input-fields": true,
        "input-error": errors.length > 0
    })

    return (
        <React.Fragment>
            <Layout simple={true}>
                <br />

                <div className="signup-container">
                    <h1>Create your Rec-it Account</h1>

                    <span className="error">
                        {errorDisplay}
                    </span>

                    <section className="signup-reasons">
                        <h2>Start Playing Today!</h2>
                        <p><i className="material-icons">calendar_today</i>Easily organize games with your friends</p>
                        <p><i className="material-icons">public</i>Engage with your community through public games</p>
                        <p><i className="material-icons">emoji_people</i>Find new players for your favorite sports and games</p>
                        <p><i className="material-icons">thumb_up</i>It's totally free</p>
                        <p className="learn-more">Learn more at our <Link href="/About"><a><u>About Page</u></a></Link></p>
                    </section>

                    <section className="signup-actions">
                        {!smsSent ?
                        <React.Fragment>
                            <FacebookLogin
                                appId={API.facebook}
                                autoLoad={false}
                                scope="public_profile, email, user_birthday, user_gender"
                                fields="name, email, picture, birthday, gender"
                                icon="fa fa-facebook-square"
                                textButton="Sign Up with Facebook"
                                callback={responseFacebook}
                            />

                            <h4>OR</h4>

                            <div className="form-group reduced-width">
                                <label className="text-muted title">Sign Up with Phone Number</label>
                                <MaskedInput 
                                    mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    style={{ width: '100%', padding: '12px 20px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                                    guide={false}
                                    onChange={(e) => {
                                        setErrors([]);
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
                                        else if (response.data.createUserPhone) {
                                            setSMSSent(true);
                                        }
                                    })
                                }}
                            >Send SMS Code</button>
                            :
                            null}
                        </React.Fragment>
                        :
                        <div className="info-form">
                            <h3 style={{ marginBottom: '1em' }}>Let other players know who you are</h3>

                            <div className="form-group half-width">
                                <label className="text-muted">First Name</label>
                                <input 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    type="text" 
                                    className="input-fields"
                                    maxLength="25"
                                    placeholder="First name"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label className="text-muted">Last Name</label>
                                <input 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    type="text" 
                                    className="input-fields"
                                    maxLength="25"
                                    placeholder="Last name"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label className="text-muted">Birth Date</label>
                                <input 
                                    onChange={(e) => setDOB(e.target.value)} 
                                    type="date" 
                                    className="input-fields"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label className="text-muted">Gender</label>
                                <select className="input-fields" placeholder="" onChange={(e) => setGender(e.target.value)}>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="non-binary">Non-binary</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="text-muted">SMS Code</label>
                                <input 
                                    onChange={(e) => {
                                        setErrors([]);
                                        setPhoneCode(e.target.value);
                                    }} 
                                    type="text" 
                                    className={inputClass}
                                    placeholder="Verify your phone number"
                                />
                            </div>

                            {/* <i 
                                className="material-icons back-arrow" 
                                onClick={() => setSMSSent(false)} 
                            >keyboard_backspace</i> */}

                            {(firstName && lastName && dob && gender && phoneCode) ?
                            <button 
                                className="form-button"
                                onClick={() => {
                                    setUserInput({
                                        phoneNumber: phoneNumber,
                                        phoneCode: (isNaN(phoneCode) || phoneCode.toString().length > 9) ? 1 : parseInt(phoneCode),
                                        name: firstName + ' ' + lastName, 
                                        dob: dob,
                                        gender: gender,
                                        loginLocation: location
                                    });
                                }}
                            >SIGN UP</button>
                            :
                            null}
                        </div>
                        }

                        <p>By clicking "Sign up" you agree to our terms of service, privacy policy, and cookie policy</p>
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
                    width: 100%;
                    height: 100%;
                    padding: 0 10%;
                    margin: auto;
                    margin-top: 2em;
                    text-align: center;
                    animation: fadein 0.75s;
                }

                a > u {
                    // font-weight: bold;
                    font-size: 1.1em;
                    color: var(--greenapple);
                }

                h1 {
                    margin-bottom: 16px;
                    font-weight: 200;
                    color: #0c0d0e;
                }

                section {
                    display: inline-block;
                }

                .signup-reasons {
                    width: 520px;
                    height: 300px;
                    padding-top: 25px;
                    text-align: left;
                }

                h2 {
                    text-align: center;
                    font-weight: 500;
                    margin-bottom: 0.5em;
                }

                i {
                    margin-right: 18px;
                    vertical-align: middle;
                }

                .signup-reasons > p {
                    line-height: 2.5em;
                    font-size: 1.1em;
                }

                .learn-more {
                    margin-top: 4px;
                    color: #616770;
                }

                .signup-actions {
                    position: relative;
                    vertical-align: top;
                    width: 500px;
                    height: 420px;
                    padding: 12px;
                    padding-top: 20px;
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.1);
                }

                h4 {
                    margin: 3em;
                    color: #616770;
                }

                .text-muted {
                    float: left;
                    font-size: 1.2em;
                }

                .title {
                    float: none;
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
                    width: 80%;
                    height: 2.5em;
                    margin-top: 0.5em;
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                .info-form { 
                    animation-duration: 1s;
                    animation-name: fadein;
                }

                .back-arrow {
                    margin: 0;
                    float: left;
                    cursor: pointer;
                }

                .reduced-width { 
                    display: inline-block;
                    width: 80%;
                }

                .half-width {
                    display: inline-block;
                    width: 50%;
                    padding-right: 0.5em;
                }

                .login-link {
                    display: block;
                    width: 100%;
                    text-align: center;
                    margin-top: 1.5em;
                    font-size: 1.2em;
                }

                .error {
                    text-align: center;
                    padding: 12px;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    } 
                    
                    to {
                        opacity: 1;
                    }
                }

                /******************
                *     Laptop      *
                *******************/
                @media only screen and (max-width: 1280px) {
                    .signup-container {
                        padding: 0;
                    }

                    .signup-reasons {
                        width: 265px;
                        margin-right: 32px;
                    }
                }

                /******************
                *     Tablet      *
                *******************/
                @media only screen and (max-width: 800px) {
                    .signup-reasons {
                        display: none;
                    }
                }

                /******************
                *     Mobile      *
                *******************/
                @media only screen and (max-width: 600px) {
                    .signup-reasons {
                        display: none;
                    }

                    .signup-actions {
                        width: 100%;
                        float: clear;
                    }

                    h1 {
                        font-size: 1.6em;
                        margin-bottom: 16px;
                    }

                    .login-link {
                        position: absolute;
                        bottom: 20px;
                        height: 20px;
                    }
                }

                /******************
                *    Landscape    *
                *******************/
                @media only screen and (max-height: 600px) {
                    .signup-container {
                        margin-top: 8px;
                    }

                    .login-link {
                        position: relative;
                        bottom: 20px;
                        height: 20px;
                    }
                }
            `}</style>      
        </React.Fragment>
    );
}

export default withApollo(Signup);