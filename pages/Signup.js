import Layout from '../components/Layout/Layout';
import React, { Component } from 'react';
import Router from 'next/router';
import MaskedInput from 'react-text-mask';
import Link from 'next/link';
import { Mutation } from 'react-apollo'
import { withApollo } from '../lib/apollo';
import gql from 'graphql-tag';

const SIGNUP = gql`
    mutation CreateUser($userInput: userInput) {
        createUser(userInput: $userInput) 
        {
            name
        }
    }
    `;

class Signup extends Component {
    constructor() {
        super()
        this.state = { 
            name: "",
            password: "",
            phoneNumber: "(123)123-1234",
            age: 90,
            gender: "M"
        }
    }

    handleChange = (input) => (e) => {
        this.setState({ [input]: e.target.value });
    };

    render() {
        const {name, password, phoneNumber, age, gender} = this.state;
       return (
       <Layout>
        <div>
                <h1 style={{textAlign: 'center'}}>Signup for an Account</h1><br />
                <div className="container">
                    <div style={{gridColumn: '2 / 3'}}>
                        <Mutation 
                            mutation={SIGNUP}
                            variables={{ userInput: {
                                name: name,
                                password: password,
                                phoneNumber: phoneNumber,
                                age: parseInt(age),
                                gender: gender
                            } }}
                        >
                            { Signup => (  
                            <form onSubmit={e => {
                                e.preventDefault();
                                Signup()
                                .then(response => {
                                    Router.push('/Login');
                                });
                            }}>
                                <div className="form-group">
                                    <label className="text-muted">Name</label>
                                    <input 
                                        onChange={this.handleChange("name")} 
                                        type="text" 
                                        className="input-fields"
                                        value={name} 
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-muted">Password</label>
                                    <input 
                                        onChange={this.handleChange("password")} 
                                        type="password" 
                                        className="input-fields"
                                        value={password} 
                                        placeholder="Password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-muted">Phone Number</label>
                                    <MaskedInput 
                                        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        style={{width: '100%', padding: '12px 20px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '4px'}}
                                        guide={false}
                                        value={phoneNumber}
                                        onChange={this.handleChange("phoneNumber")}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-muted">Age</label>
                                    <input 
                                        onChange={this.handleChange("age")} 
                                        type="number" 
                                        className="input-fields"
                                        value={age} 
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-muted">Gender</label>
                                    <select className="input-fields" value={gender} onChange={this.handleChange("gender")}>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <input type="submit" value="Submit" />
                            </form>
                            )}
                        </Mutation>
                        <br />
                        <div style={{textAlign: 'center'}}>
                            <p>Already have an Account? <Link href="/Login"><a style={{color: '#3399ff'}}><u>Log in!</u></a></Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .container {
                    display: grid;
                    align-items: center;
                    grid-template-columns: .75fr 650px .75fr;
                    grid-template-rows: auto auto;
                    grid-gap: 10px;
                }

                .input-fields {
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

                form {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 12px 20px;
                }

                bottom: {
                    grid-column: 2 / 3;
                    grid-row-start: 2;
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

export default withApollo(Signup);