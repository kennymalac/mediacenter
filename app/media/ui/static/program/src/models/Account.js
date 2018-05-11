import {Model, Collection} from './Model.js'
import {fetchAPI, jsonResponse} from '../httputil.js'

class AccountModel extends Model {

    static initialState = {
        id: 0,
        username: "",
        email: "",
        country: "",
        account_settings: {},
        groups: [],
        friends: [],
        profile: {}
    }
}

export function makeAccountCollection() {
    return AccountCollection.all().then((data) => {
        return new AccountCollection(data)
    })
}

class AccountCollection extends Collection {
    static Model = AccountModel

    static get(id) {
        return fetchAPI(`accounts/${id}`, {
            method: "GET"
        })
            .then(jsonResponse)
    }

    static all() {
        return fetchAPI(`accounts/`, {
            method: "GET"
        })
            .then(jsonResponse)
    }
}

export {AccountModel, AccountCollection}
