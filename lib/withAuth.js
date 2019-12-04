import React, {Component} from 'react';
import AuthService from './AuthService';
import Router from 'next/router';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService('http://localhost:3000');
    return class Authenticated extends Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {
            if ( !Auth.loggedIn() && !((Router.pathname === '/About') || (Router.pathname === '/Login') || (Router.pathname === '/Signup')) ) {
                Router.push('/');     
            }
        }

        render() {
            return (
                <React.Fragment>
                    <AuthComponent {...this.props} auth={Auth} />
                </React.Fragment>
            )
        }
    }
}
