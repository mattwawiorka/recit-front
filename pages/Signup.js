import Layout from '../components/Layout/Layout';
import React, { Component } from 'react';
import Router from 'next/router';
import MaskedInput from 'react-text-mask';
import Link from 'next/link';
import { Mutation } from 'react-apollo'
import { withApollo } from '../lib/apollo';
import gql from 'graphql-tag';
import cookie from 'js-cookie';
import API from '../api.json';

const SIGNUP = gql`
    mutation CreateUser($userInput: userInput, $name: String!, $password: String!, $location: [Float], $city: String) {
        createUser(userInput: $userInput) 
        {
            name
        }

        login(name: $name, password: $password, location: $location, city: $city) 
        {
            token
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
            dob: "",
            gender: "F",
            errors: [{message: ""}],
            location: [47.7169839910907, -122.32040939782564]
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                location: [position.coords.latitude, position.coords.longitude]
            })
        })

    }


    handleChange = (input) => (e) => {
        this.setState({ 
            [input]: e.target.value,
            errors: [{message: ""}]
         });
    };

    render() {
        const { name, password, phoneNumber, dob, gender, location } = this.state;
        const errors = [];
        this.state.errors.map( error => {
            errors.push(
            <li key={error.message}>
                {error.message}
            </li>
            );
        })

        return (
            <Layout>
            <br />
            <div>
                <h1 style={{textAlign: 'center', paddingTop: '25px'}}>Signup for an Account</h1><br />
                <div className="container">
                    <div style={{ gridColumn: '2 / 3' }}>

                        <span 
                            className="alert"
                            style={{ display: (this.state.errors[0].message !== "") ? "" : "none" }}
                        >
                            {errors}
                        </span>

                        <Mutation 
                            mutation={SIGNUP}
                        >
                            { Signup => (  
                            <form onSubmit={e => {
                                e.preventDefault();
                                fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.location[0]},${this.state.location[1]}&key=${API.key}`)
                                .then((response) => {
                                    return response.json()
                                    .then(result => {
                                        Signup({ variables: 
                                            { userInput: {
                                                name: name,
                                                password: password,
                                                phoneNumber: phoneNumber,
                                                dob: dob,
                                                gender: gender
                                            }, name: name, password: password, location: location, city: result.results[5].formatted_address }
                                        })
                                        .then(response => {
                                            if (response.errors) {
                                                this.setState({
                                                    errors: response.errors[0].data
                                                })
                                                return;
                                            }
                                            cookie.set('token', response.data.login.token, { expires: 1 })
                                            if (Router.query.invited) {
                                                Router.push('/Game/[game]', `/Game/${Router.query.game}`);
                                            } else {
                                                Router.push('/');
                                            } 
                                        })
                                        .catch(error => {
                                            console.log(error)
                                        });
                                    })
                                })
                                
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
                                    <label className="text-muted">Birth Date</label>
                                    <input 
                                        onChange={this.handleChange("dob")} 
                                        type="date" 
                                        className="input-fields"
                                        value={dob} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-muted">Gender</label>
                                    <select className="input-fields" value={gender} placeholder="" onChange={this.handleChange("gender")}>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="N">Non-binary</option>
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
                <style jsx>{`
                    .container {
                        display: grid;
                        align-items: center;
                        grid-template-columns: 5vw 50vw 5vw;
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
                        background-color: var(--darkermatter);
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
                        background-color: var(--darkmatter);
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
            </div>       
        </Layout>
        );
    }  
}

export default withApollo(Signup);