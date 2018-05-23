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

    async get(id, collections, instance = null) {
        return await get(this, id, instance, {...collections, friends: this})
    }

    static create(data) {
        return makeJsonRequest('account/', {
            method: "POST",
            body: data,
            authenticated: false
        })
            .then(jsonResponse)
    }

    async list(params, collections) {
        return await paginatedList(this, 0, {...collections, friends: this}, [
            ['friends', this.get.bind(this)],
            ['profile', collections.profile.get.bind(collections.profile)]
        ])
    }
}

export {AccountModel, AccountCollection}
