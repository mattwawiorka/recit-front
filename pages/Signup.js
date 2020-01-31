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

const SIGNUP_FB = gql`
    mutation CreateUserFb($userInput: userInput) {
        createUserFb(userInput: $userInput) 

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

    const [location, setLocation] = useState([47.7169839910907, -122.32040939782564]);
    const [userInput, setUserInput] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [dob, setDOB] = useState(null);
    const [gender, setGender] = useState(null);
    const [phoneCode, setPhoneCode] = useState(null);
    const [smsSent, setSMSSent] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    const [signupFb] = useMutation(SIGNUP_FB);
    const [sendSMS] = useMutation(SEND_SMS);
    const [signupPhone] = useMutation(SIGNUP_PHONE);

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
        if (!userInput) {
            return; 
        }
        else if (userInput.facebookToken) {
            signupFb({ variables: { userInput: userInput } })
            .then(response => {
                if (response.errors) {
                    setErrors(response.errors[0].data)
                    return;
                }

                if (response.data.createUserFb) {
                    cookie.set('token', response.data.loginFb, { expires: 1 })

                    if (Router.query.invited) {
                        Router.push('/Game/[game]', `/Game/${Router.query.game}`);
                    } else {
                        Router.push('/');
                    } 
                } 
            }) 
        } 
        else if (userInput.phoneCode) {
            signupPhone({ variables: { userInput: userInput } })
            .then(response => {
                if (response.errors) {
                    setErrors(response.errors[0].data)
                    return;
                }

                cookie.set('token', response.data.verifyUserPhone, { expires: 1 })

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
                                        let number = e.target.value.replace('(','');
                                        number = number.replace(')','');
                                        number = number.replace('-','');
                                        number = number.replace(' ','');
                                        setPhoneNumber(number);
                                    }}
                                    placeholder="(123) 123-1234"
                                />
                            </div>

                            <button 
                                className="form-button"
                                onClick={() => {
                                    sendSMS({ variables: { phoneNumber: phoneNumber }  })
                                    .then(response => {
                                        console.log(response)
                                        if (response.data.createUserPhone) {
                                            setSMSSent(true);
                                        }
                                    })
                                }}
                            >Send SMS Code</button>
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
                                    placeholder="First name"
                                />
                            </div>
                            <div className="form-group half-width">
                                <label className="text-muted">Last Name</label>
                                <input 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    type="text" 
                                    className="input-fields"
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
                                    onChange={(e) => setPhoneCode(e.target.value)} 
                                    type="text" 
                                    className="input-fields"
                                    placeholder="Verify your phone number"
                                />
                            </div>

                            {/* <i 
                                className="material-icons back-arrow" 
                                onClick={() => setSMSSent(false)} 
                            >keyboard_backspace</i> */}

                            <button 
                                className="form-button"
                                onClick={() => {
                                    setUserInput({
                                        phoneNumber: phoneNumber,
                                        phoneCode: parseInt(phoneCode),
                                        name: firstName + ' ' + lastName, 
                                        dob: dob,
                                        gender: gender,
                                        loginLocation: location
                                    });
                                }}
                            >SIGN UP</button>
                        </div>
                        }

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

                i {
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
                    // text-align: left;
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

                .signup-actions > p {
                    position: absolute;
                    bottom: 10px;
                    font-size: 0.9em;
                    color: #616770;
                }

                .form-button {
                    width: 70%;
                    height: 2.5em;
                    margin-top: 0.5em;
                }

                .info-form { 
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

                .back-arrow {
                    margin: 0;
                    float: left;
                    cursor: pointer;
                }

                .reduced-width { 
                    display: inline-block;
                    width: 70%;
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