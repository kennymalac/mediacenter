import {Model, Collection} from './Model.js'
import {GroupCollection} from './Group'
import {ProfileCollection} from './Profile'
import {get, paginatedList} from './generics.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'

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

    static fields = {
        groups: [GroupCollection],
        friends: [AccountCollection],
        profile: ProfileCollection
    }
}

export async function makeAccountCollection() {
    return new AccountCollection([])
}

class AccountCollection extends Collection {
    static Model = AccountModel

    static resource = 'account'

    async get(id, instance = null) {
        return await get(this, id, instance)
    }

    static create(data) {
        return makeJsonRequest('accounts/', {
            method: "POST",
            body: data,
            authenticated: false
        })
            .then(jsonResponse)
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections, [
            ['friends', this.get],
            ['profile', collections.profiles.get]
        ])
    }
}

export {AccountModel, AccountCollection}
