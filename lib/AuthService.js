import cookie from 'js-cookie';

class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost:3000';
    }

    loggedIn() {
        // Checks for token and whether it's still valid
        const token = this.getToken();
        const user = this.getUser();
        return !!token && !!user;
    }

    getToken() {
        // Retrieves the user token from localStorage
        return cookie.get('token');
    }

    getUser() {
        // Retrieves the user that is logged in
        const user = window.localStorage.getItem('user');
        return user;
    }

    logout() {
        localStorage.removeItem('user');
        cookie.remove('token');
    }

}

export default AuthService;