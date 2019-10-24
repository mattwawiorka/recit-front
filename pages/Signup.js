import Layout from '../components/Layout/Layout';
import React, { Component } from 'react';
import axios from 'axios';
import Router from 'next/router';

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

    clickCreate = e => {
        e.preventDefault();
        const {name, password, phoneNumber, age, gender} = this.state;
        let graphqlQuery = {
            query: `
            mutation {
                createUser(userInput: {
                    name: "${name}",
                    phoneNumber: "${phoneNumber}",
                    password: "${password}",
                    age: ${age},
                    gender: "${gender}"
                }) 
                {
                    name
                }
            }
        `
        };

        axios({
            url: 'http://localhost:8080/graphql',
            method: 'post',
            data: graphqlQuery
        })
        .then( response => { 
            this.setState({
                name: "",
                password: "",
                phoneNumber: "",
                age: "",
                gender: ""
            })
            Router.push('/Login');
        })
        .catch( err => {
            console.log(err);
        })
    }

    render() {
        const {name, password, phoneNumber, age, gender} = this.state;
       return (
       <Layout>
        <div>
                <h1>Signup page</h1>
                <div className="container">
                    <form>
                        <div className="form-group">
                            <label className="text-muted">Name</label>
                            <input 
                                onChange={this.handleChange("name")} 
                                type="text" 
                                className="form-control"
                                value={name} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Password</label>
                            <input 
                                onChange={this.handleChange("password")} 
                                type="text" 
                                className="form-control"
                                value={password} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Phone Number</label>
                            <input 
                                onChange={this.handleChange("phoneNumber")} 
                                type="text" 
                                className="form-control"
                                value={phoneNumber} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Age</label>
                            <input 
                                onChange={this.handleChange("age")} 
                                type="number" 
                                className="form-control"
                                value={age} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Gender</label>
                            <input 
                                onChange={this.handleChange("gender")} 
                                type="text" 
                                className="form-control"
                                value={gender} 
                            />
                        </div>
                        <button 
                            className="btn btn-raised btn-primary"
                            onClick={this.clickCreate}>
                            Let's Play!
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
       );
    }  
}

export default Signup;