import {Model, Collection} from './Model.js'
import {fetchAPI, jsonResponse} from '../httputil.js'

class AccountModel extends Model {

    static initialState = {
        id: 0,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        country: "",
        account_settings: {}
    }
}

export function makeAccountCollection() {
    return AccountCollection.all().then((data) => {
        return new AccountCollection(data)
    })
}

class AccountCollection extends Collection {
    static Model = AccountModel

    static all() {
        return fetchAPI(`accounts/`, {
            method: "GET"
        })
            .then(jsonResponse)
    }
}

export {AccountModel, AccountCollection}
