import Layout from '../components/Layout/Layout';
import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import cookie from 'cookie';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo'
import { withApollo } from '../lib/apollo';

const LOGIN = gql`
    mutation Login($name: String!, $password: String!) {
        login(name: $name, password: $password) 
        {
            token
            userId
        }
    }
    `;

class Login extends Component {
    constructor() {
        super()
        this.state = { 
            name: "",
            password: "",
            error: ""
        }
    }

    handleChange = (input) => (e) => {
        this.setState({ 
            [input]: e.target.value,
            error: ""
         });
    };

    render() {
        const {name, password} = this.state;
       return (
       <Layout>
        <div>
            <h1 style={{textAlign: 'center'}}>Sign into Recit</h1><br />
            <div className="container">
                <div></div>
                <div className="center-content">

                    <span 
                        className="alert"
                        style={{ display: this.state.error ? "" : "none" }}
                    >
                        {this.state.error}
                    </span>

                    <div>
                        <Mutation 
                            mutation={LOGIN}
                            variables={{ name, password }}
                        >
                            { Login => (    
                            <form onSubmit={e => {
                                e.preventDefault();
                                Login()
                                .then(response => {
                                    if (response.errors) {
                                        this.setState({
                                            error: response.errors[0].message
                                        })
                                        return;
                                    }
                                    window.localStorage.setItem('user', response.data.login.userId)
                                    document.cookie = cookie.serialize('token', response.data.login.token, {
                                        sameSite: true,
                                        path: '/',
                                        maxAge: 24 * 60 * 60
                                    })
                                    Router.push('/');
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                            }}>
                                <div className="form-group">
                                    <input 
                                        onChange={this.handleChange("name")} 
                                        type="text" 
                                        value={name}
                                        className="text-fields"
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="form-group">
                                    <input 
                                        onChange={this.handleChange("password")} 
                                        type="password" 
                                        value={password} 
                                        className="text-fields"
                                        placeholder="Password"
                                    />
                                </div>
                                <input type="submit" value="Submit" />
                            </form>
                            )}
                        </Mutation>
                        <br />
                        </div>
                        <div className="bottom">
                            <div>
                                <Link href="/Forgot_Password"><a style={{color: '#3399ff'}}>Forgot Password?</a></Link>
                            </div>
                            <div style={{textAlign: 'center'}}> | </div>
                            <div>
                                <p style={{float: 'right'}}>Don't have an account? <br />
                                    <Link href="/Signup"><a style={{color: '#3399ff'}}><u>Signup for one!</u></a></Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .container {
                    display: grid;
                    align-items: center;
                    grid-template-columns: .75fr 650px .75fr;
                    grid-gap: 10px;
                }

                .center-content {
                    display: inline-grid;
                    align-items: center;
                    grid-template-columns: repeat(1, 1fr);
                }

                .bottom {
                    display: grid;
                    grid-template-columns: 1fr .5fr 1fr;
                }

                form {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 12px 20px;
                    
                }

                .text-fields {
                    width: 100%;
                    padding: 12px 20px;
                    margin: 8px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                input[type=submit] {
                    width: 100%;
                    background-color: var(--darkermatter);
                    color: white;
                    padding: 14px 20px;
                    margin 8px 0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                input[type=submit]:hover {
                    background-color: var(--darkmatter);
                }

                .alert {
                    // padding: 10px 16px;
                    // border-style: solid;
                    // border-color: #e14646;
                    // border-radius: 10px;
                    // background-color: #ffcccb; /* Red */
                    // box-shadow: 0 0 10px #ffcccb;
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
        </Layout>
       );
    }  
}

export default withApollo(Login);