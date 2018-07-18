import {Model, Collection, serializeIds} from './Model.js'
import {get, manage, resolveInstances} from './generics.js'
import {AccountCollection} from './Account.js'
import {FeedCollection} from './Feed.js'

import {makeJsonRequest, jsonResponse} from '../httputil.js'

export function makeGroupCollection(deps) {
    return new GroupCollection([], deps)
}

export async function filterGroupCollection(collection, queryset, deps) {
    const values = await queryset()
    const members = await deps.members

    await resolveInstances(
        collection,
        values,
        deps,
        [
            ['members', members.get.bind(members)]
        ]
    )
}

class GroupModel extends Model {

    static resource = 'group'

    static fields = {
        // fields only works for lists, not a single item
        members: [AccountCollection],
        feed: FeedCollection,
        owner: [AccountCollection]
    }

    static initialState = {
        id: 0,
        feed: {},
        owner: {},
        name: "",
        description: "",
        rules: [],
        members: [],
        image: "",
        is_restricted: false,
        is_local: false
    }
}

class GroupCollection extends Collection {
    static Model = GroupModel

    static resource = 'group'

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections)
    }

    create(form, collections) {
        return makeJsonRequest("group/", {
            method: "POST",
            body: {
                ...form,
                members: serializeIds(form.members),
                owner: form.owner.id,
                feed: {...form.feed, visibility: form.feed.visibility.value, owner: form.feed.id, interests: serializeIds(form.feed.interests)}
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

    async manage(instance, form, collections) {
        console.log(form)
        return await manage(this, instance, {
            ...form,
            members: serializeIds(form.members),
            owner: form.owner.id,
            feed: {...form.feed, visibility: form.feed.visibility.value, owner: form.owner.id, stashes: serializeIds(form.feed.stashes), interests: serializeIds(form.feed.interests)}
        }, collections)
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
            body: {...data, interests: serializeIds(data.interests)}
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

    join(instance, activeAccount) {
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

    leave(instance, activeAccount) {
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

export {GroupCollection, GroupModel}
