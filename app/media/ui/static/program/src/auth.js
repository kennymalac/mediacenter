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
                details: { id: 0, member_groups: [], username: null, user_settings: {}, profile: {} },
                token: null
            }
        }

        let [persistedToken, username] = this.getActiveUserSessionToken()
        try {
            if (persistedToken && username) {
                this.getPersistedToken = async () => {
                    await this.refreshToken(persistedToken)
                    this.currentSession.user.details.username = username
                }
                this.getPersistedToken()
            }
        }
        catch (e) {
            console.log(e)
            // Ignore error
        }
    }

    getActiveUser() {
        return new Proxy(this.currentSession.user, {})
    }

    getActiveUserSessionToken() {
        let activeUser = localStorage.getItem(this.storageKey + "activeUser")
        if (activeUser) {
            console.log(activeUser)
            // return the refresh token that is being stored
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
            return this.refreshToken(localStorage.getItem(this.storageKey + this.currentSession.user.details.username))
        }
        // return localStorage.getItem(this.storageKey + this.currentSession.user.username)

        return this.currentSession.user.token
    }
    refreshToken(token) {
        return makeJsonRequest('api-token-refresh/', {
            method: 'POST',
            authenticated: false,
            headers: {
                'Cache': 'no-cache'
            },
            body: {
                refresh: token
            }
        }, `${API_URL}/`)
            .then(jsonResponse)
            .then((data) => {
                let token = data.access
                this.currentSession.user.token = token
            })
    }

    login(username, password) {
        return makeJsonRequest('api-token-auth/', {
            method: 'POST',
            authenticated: false,
            headers: {
                'Cache': 'no-cache'
            },
            body: {
                username: username,
                password: password
            }
        }, `${API_URL}/`)
            .then(jsonResponse)
            .then((data) => {
                let token = data.access
                this.currentSession.user.token = token
                this.currentSession.user.details.username = username
                localStorage.setItem(this.storageKey + "activeUser", username)
                localStorage.setItem(this.storageKey + username, data.refresh)
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
        headers = this.authenticate(headers)
        return fetchAPI('account/current-user/', {
            method: 'GET',
            // Get authentication headers
            headers: headers
        })
            .then(jsonResponse)
            .then((data) => {
                this.currentSession.user.details = {...this.currentSession.user.details, ...data}
            })
            .catch((error) => {
                errorCallback(error)
            })
    }

    authenticate(headers) {
        return Object.assign({}, headers, {
            "Authorization": 'Bearer ' + this.currentSession.user.token
        })
    }
}

export const auth = new Auth()

export async function makeActiveUser() {
    if (auth.getPersistedToken) {
        await auth.getPersistedToken()
    }
    return auth.getProfile((error) => {
        // TODO better error callback
        console.log('auth error')
        console.log(error.response)
    }).then(() => {
        return auth.getActiveUser()
    })
}
