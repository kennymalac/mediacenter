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

    static async resolveLog(instance, collections) {
        switch (instance.action) {
        case 'create_topic':
        case 'read_topic':
        case 'update_topic':
        case 'delete_topic':
        case 'save_topic':
            // TODO resolve stash
            const {instance: topic, group} = await Collection.fetchAll(
                collections,
                { instance: instance.context.instance, group: instance.context.group },
                { instance: collections.discussions, group: collections.groups })

            return {...instance.instance, link: `/group/${instance.context.group}/details/stash/${instance.context.stash}/details/discussion/${instance.context.instance}/details/`, context: { instance: topic, group }} // , stash
        case 'create_link':
        case 'read_link':
        case 'update_link':
        case 'delete_link':
        case 'save_link':
            const {instance: link, feed} = await Collection.fetchAll(
                collections,
                { instance: instance.context.instance, feed: instance.context.feed },
                { instance: collections.links, feed: collections.feed })

            return {...instance.instance, link: `/feed/${instance.context.feed}/details/stash/${instance.context.stash}/details/link/${instance.context.instance}/details/`, context: { instance: link, feed }}

        default:
            return instance.context
        }
    }
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
