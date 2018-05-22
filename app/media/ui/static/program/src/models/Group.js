import {Model, Collection, serializeIds} from './Model.js'
import {get, manage, resolveInstances} from './generics.js'
import {AccountCollection} from './Account.js'
import {FeedCollection} from './Feed.js'

import {makeJsonRequest, jsonResponse} from '../httputil.js'

export async function makeGroupCollection() {
    return new GroupCollection([])
}

export async function makeFilteredGroupCollection(queryset, _feeds, _accounts) {
    let [members, feed, values] = await Promise.all(
        [_accounts(), _feeds(), queryset()]
//        _feeds()
    )
    const collection = new GroupCollection([])

    await resolveInstances(
        collection,
        values,
        { feed, members },
        [
            ['members', members.get]
        ]
    )

    return collection
}

class GroupModel extends Model {

    static resource = 'group'

    static fields = {
        // fields only works for lists, not a single item
        members: [AccountCollection],
        feed: FeedCollection
    }

    static initialState = {
        id: 0,
        feed: {},
        name: "",
        description: "",
        rules: [],
        members: [],
        image: ""
    }

    static async manage(instance, form, collections) {
        return await manage(instance, {
            ...form,
            members: serializeIds(form.members),
            feed: {...form.feed, interests: serializeIds(form.feed.interests)}
        }, collections)
    }

    static join(instance, activeAccount) {
        return makeJsonRequest(`group/${instance.id}/join/`, {
            method: "POST",
            body: {}
        })
            .then(jsonResponse)
            .then((data) => {
                // Add the user to the group member list
                instance.members.push(activeAccount)
            })
    }

    static leave(instance, activeAccount) {
        return makeJsonRequest(`group/${instance.id}/leave/`, {
            method: "POST",
            body: {}
        })
            .then(jsonResponse)
            .then((data) => {
                // Remove the user from this group
                instance.members = instance.members.filter((account) => {
                    return activeAccount.id !== account.id
                })
            })
    }
}

class GroupCollection extends Collection {
    static Model = GroupModel

    static resource = 'group'

    async get(id, instance = null) {
        return await get(this, id, instance)
    }

    create(form, collections) {
        return makeJsonRequest("group/", {
            method: "POST",
            body: {
                ...form,
                members: serializeIds(form.members),
                feed: {...form.feed, interests: serializeIds(form.feed.interests)}
            }
        })
            .then(jsonResponse)
            .then((createdData) => {
                const instance = this.addInstance({
                    ...createdData, members: form.members, feed: {...createdData.feed, ...form.feed}
                }, collections)

                return instance
            })
    }

    static list(params = {}) {
        return makeJsonRequest(`group/`, {
            method: "GET",
            queryParams: params
        })
            .then(jsonResponse)
    }

    static searchGroups(data) {
        console.log(data)
        return makeJsonRequest(`group/search/`, {
            method: "POST",
            body: {interests: serializeIds(data.interests)}
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

}

export {GroupCollection, GroupModel}
