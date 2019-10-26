import Layout from '../components/Layout/Layout';
import React, { Component } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';

class Login extends Component {
    constructor() {
        super()
        this.state = { 
            name: "",
            password: ""
        }
    }

    handleChange = (input) => (e) => {
        this.setState({ [input]: e.target.value });
    };

    clickLogin = e => {
        e.preventDefault();
        const {name, password} = this.state;
        let graphqlQuery = {
            query: `
                {
                    login(name: "${name}", password: "${password}") 
                    {
                        token
                        userId
                    }
                }
            `
        }

        axios({
            url: 'http://localhost:8080/graphql',
            method: 'post',
            data: graphqlQuery
        })
        .then( response => { 
            this.setState({
                name: "",
                password: ""
            })
            localStorage.setItem('token', response.data.data.login.token);
            localStorage.setItem('userId', response.data.data.login.userId);
            Router.push('/');
        })
        .catch( err => {
            console.log(err);
        })
    }

    render() {
        const {name, password} = this.state;
       return (
       <Layout>
        <div>
                <h1 style={{textAlign: 'center'}}>Sign into Recit</h1><br />
                <div className="container">
                    <div></div>
                    <div className="center-content">
                        <div>
                            <form onSubmit={this.clickLogin}>
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
                            </form><br />
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
                    background-color: var(--greenapple);
                    color: white;
                    padding: 14px 20px;
                    margin 8px 0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                input[type=submit]:hover {
                    background-color: #45a049;
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

export default Login;