import {Model, Collection} from './Model.js'
import {get, paginatedList, resolveInstances} from './generics.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'

export async function makeActivityLogCollection() {
    return new ActivityLogCollection([])
}

export async function makeFilteredActivityLogCollection(queryset, _feeds, _stashes, _accounts, _profiles, _contentTypes) {
    let [members, feed, stashes, profile, values, contentTypes] = await Promise.all(
        [_accounts(), _feeds(), _stashes(), _profiles(), queryset(), _contentTypes()]
        //        _feeds()
    )
    const collection = new ActivityLogCollection([])

    await resolveInstances(
        collection,
        values,
        { account: members, feed, stashes, profile, content_types: contentTypes, owner: members, author: members }
    )

    return collection
}

class ActivityLogModel extends Model {

    static initialState = {
        id: 0,
        action: "",
        message: "",
        context: {},
        author: {}
    }

    static fields = {
        author: Collection
    }

    static resource = 'activity'
}

class ActivityLogCollection extends Collection {

    static Model = ActivityLogModel

    static resource = 'activity'

    async get(id, collections, instance = null) {
        return await get(this, id, instance)
    }

    async list(params, collections) {
        return await paginatedList(this, params, collections)
    }

    static searchActivityLogs(params = {}) {
        return makeJsonRequest(`activity/`, {
            method: "GET",
            queryParams: params
        })
            .then(jsonResponse)
    }
}

export {ActivityLogCollection, ActivityLogModel}
