import {fetchAPI, jsonResponse} from '../httputil.js'

class AccountCollection {

    static all() {
        return fetchAPI(`accounts/`, {
            method: "GET"
        })
            .then(jsonResponse)
    }
}

export {AccountCollection}
