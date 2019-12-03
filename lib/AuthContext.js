import React from 'react';
import AuthService from './AuthService';

const Auth = new AuthService('http://localhost:3000');

const AuthContext = {
    loggedIn: Auth.loggedIn(),
    user: Auth.getUser(),
    logout: Auth.logout
}

export default React.createContext(AuthContext);