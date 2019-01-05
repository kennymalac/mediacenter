import {Model, Collection} from './Model.js'
import {get, manage, paginatedList} from './generics.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'

class AccountModel extends Model {

    static initialState = {
        id: 0,
        username: "",
        email: "",
        country: "",
        account_settings: {},
        notify_settings: {},
        member_groups: [],
        friends: [],
        profile: {}
    }

    static fields = {
        member_groups: [Collection],
        friends: [Collection],
        profile: Collection
    }

    static resource = 'account'
}

export async function makeAccountCollection(deps) {
    return new AccountCollection([], deps)
}

class AccountCollection extends Collection {
    static Model = AccountModel

    static resource = 'account'

    constructor(values, collections = {}) {
        super(values, collections)
        this.collections.friends = this
    }

    async get(id, collections, instance = null) {
        return await get(this, id, instance, {...collections, friends: this}, [
            ['profile', collections.profile.get.bind(collections.profile)]
        ])
    }

    async manage(instance, form) {
        return await manage(this, instance, {
            ...form
        })
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
