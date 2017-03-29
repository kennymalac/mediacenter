class Auth {
    constructor() {
        // Used for identifying local storage of user keys
        this.storageKey = 'auth_'
        // TODO manage session outside of Auth
        this.currentSession = {
            user: {
                details: { id: 0, username: null, user_settings: {}, profile_details: {} },
                token: ""
            }
        }

        // TODO persist authentication
    }

    getActiveUser() {
        return this.currentSession.user
    }

    getToken(refresh = false) {
        // if get token from storage
        //auth.getToken()

        // use that token
        // if that token is expired
        // request new token
        // if that token is invalid
        // redirect to login

        if (refresh) {
            //this.refreshToken(this.getActiveUser.username)
            return localStorage.getItem(this.storageKey + this.currentSession.user.username)
        }

        return this.currentSession.user.token
    }

    login(username, password, errorCallback) {
        return fetch('/api-token-auth/', {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json()
                } else {
                    var error = new Error(response.statusText)
                    error.response = response
                    throw error
                }
            })
            .then((data) => {
                let token = data.token
                this.currentSession.user.token = token
                this.currentSession.user.details.username = username
                localStorage.setItem(this.storageKey + this.currentSession.user.details.username, token)
                this.getProfile(errorCallback)
            })
            .catch((error) => {
                errorCallback(error)
            })
    }

    getProfile(errorCallback) {
        let headers = {}
        this.authenticate(headers)
        return fetch('/api/accounts/current-user/', {
            method: 'GET',
            // Get authentication headers
            headers: headers
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json()
                } else {
                    var error = new Error(response.statusText)
                    error.response = response
                    throw error
                }
            })
            .then((data) => {
                this.currentSession.user.details = data
            })
            .catch((error) => {
                errorCallback(error)
            })
    }

    authenticate(headers) {
        headers["Authorization"] = 'JWT ' + this.currentSession.user.token
    }
}

const auth = new Auth()
export default auth
