import {Model, Collection, serializeIds} from './Model.js'
import {get, manage, resolveInstances} from './generics.js'
import {AccountCollection} from './Account.js'
import {FeedCollection} from './Feed.js'

import {makeJsonRequest, jsonResponse} from '../httputil.js'

export async function makeGroupCollection() {
    return new GroupCollection([])
}

export async function makeFilteredGroupCollection(queryset, _feeds, _stashes, _accounts, _profiles, _interests, _contentTypes) {
    let [members, feed, stashes, profile, values, interests, contentTypes] = await Promise.all(
        [_accounts(), _feeds(), _stashes(), _profiles(), queryset(), _interests(), _contentTypes()]
//        _feeds()
    )
    const collection = new GroupCollection([])

    await resolveInstances(
        collection,
        values,
        { members, account: members, feed, stashes, profile, interests, content_types: contentTypes, owner: members, friends: members, member_groups: collection },
        [
            ['members', members.get.bind(members)]
        ]
    )

    return collection
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
        is_restricted: false
    }

    static async manage(instance, form, collections) {
        console.log(form)
        return await manage(instance, {
            ...form,
            members: serializeIds(form.members),
            owner: form.owner.id,
            feed: {...form.feed, owner: form.owner.id, stashes: serializeIds(form.feed.stashes), interests: serializeIds(form.feed.interests)}
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
                feed: {...form.feed, owner: form.feed.id, interests: serializeIds(form.feed.interests)}
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
