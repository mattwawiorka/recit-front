import cookie from 'js-cookie';
const jwt = require('jsonwebtoken');

class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost:3000';
    }

    loggedIn() {
        // Checks for token and whether it's still valid
        const token = this.getToken();
        return !!token;
    }

    getToken() {
        // Retrieves the user token from localStorage
        return cookie.get('token');
    }

    getUser() {
        // Retrieves the user that is logged in
        let user;
        const token = this.getToken();
        if (token) {
            const decodedToken = jwt.verify(token, 'secret');
            user = decodedToken.userId;
        }
        return user;
    }

    logout() {
        cookie.remove('token');
    }

}

export default AuthService;