import {API_URL} from 'config.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from './httputil.js'

export class Auth {
    constructor() {
        // Used for identifying local storage of user keys
        // NOTE horrible!!
        this.storageKey = 'auth_'
        // TODO manage session outside of Auth
        this.currentSession = {
            user: {
                details: { id: 0, username: null, user_settings: {}, profile: {} },
                token: null
            }
        }

        let [persistedToken, username] = this.getActiveUserSessionToken()
        try {
            if (persistedToken.length > 1 && username.length > 1) {
                this.currentSession.user.username = username
                this.currentSession.user.token = persistedToken
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
        if (this.currentSession.user.token) {
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
        return makeJsonRequest('api-token-auth/', {
            method: 'POST',
            body: {
                username: username,
                password: password
            }
        }, `${API_URL}/`)
            .then(jsonResponse)
            .then((data) => {
                let token = data.token
                this.currentSession.user.token = token
                this.currentSession.user.details.username = username
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
        return fetchAPI('accounts/current-user/', {
            method: 'GET',
            // Get authentication headers
            headers: headers
        })
            .then(jsonResponse)
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

export const auth = new Auth()

export function makeActiveUser() {
    return auth.getProfile((error) => {
        // TODO better error callback
        console.log(error)
    }).then(() => {
        return auth.getActiveUser()
    })
}
