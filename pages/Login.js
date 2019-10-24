import Layout from '../components/Layout/Layout';
import React, { Component } from 'react';
import axios from 'axios';
import Router from 'next/router';

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
                <h1>Login</h1>
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
                                type="password" 
                                className="form-control"
                                value={password} 
                            />
                        </div>
                        <button 
                            className="btn btn-raised btn-primary"
                            onClick={this.clickLogin}>
                            Login!
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
       );
    }  
}

export default Login;