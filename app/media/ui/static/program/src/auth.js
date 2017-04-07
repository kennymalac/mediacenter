class Auth {
    constructor() {
        // Used for identifying local storage of user keys
        this.storageKey = 'auth_'
        // TODO manage session outside of Auth
        this.currentSession = {
            user: {
                details: { id: 0, username: null, user_settings: {}, profile_details: {} },
                token: null
            }
        }

        // TODO persist authentication
        let [persistedToken, username] = this.getActiveUserSessionToken()
        try {
            if (persistedToken.length > 1 && username.length > 1) {
                this.currentSession.user.username = username
                this.currentSession.user.token = persistedToken
                // TODO better error callback
                this.getProfile((error) => {
                    console.log(error)
                })
            }
        }
        catch (e) {
            // Ignore error
        }
    }

    getActiveUser() {
        return this.currentSession.user
    }

    getActiveUserSessionToken() {
        let activeUser = localStorage.getItem(this.storageKey + "activeUser")
        if (activeUser) {
            console.log(activeUser)
            // return the token that is being stored
            return [localStorage.getItem(this.storageKey + activeUser), activeUser]
        }
        else {
            return [null, null]
        }
    }

    hasActiveUser() {
        // TODO check privilege levels
        console.log(this.currentSession.user.token)
        if (this.currentSession.user.token) {
            console.log('truttte')
            return true
        }
        else {
            return false
        }
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
                console.log(username)
                console.log(token)
                localStorage.setItem(this.storageKey + "activeUser", username)
                localStorage.setItem(this.storageKey + username, token)
                this.getProfile(errorCallback)
            })
            .catch((error) => {
                errorCallback(error)
            })
    }

    logout() {
        // Expire the user session
        localStorage.setItem(this.storageKey + "activeUser", "")

        let username = this.currentSession.user.username
        this.currentSession = {
            user: {
                details: { id: 0, username: null, user_settings: {}, profile_details: {} },
                token: null
            }
        }
        // Invalidate the user's token
        localStorage.setItem(this.storageKey + username, null)
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
