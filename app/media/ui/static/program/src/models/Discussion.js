import {Model, Collection} from './Model.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'
import {get, manage, paginatedList} from './generics.js'
import {modelInstance} from './converters'
import {FeedContentItemModel} from './FeedContentItem'
import {AccountCollection} from './Account'
import {GroupCollection} from './Group'

export function makeDiscussionCollection() {
    return DiscussionCollection.searchDiscussions().then((items) => {
        return new DiscussionCollection(items)
    })
}

class DiscussionModel extends Model {

    static initialState = {
        id: 0,
        content_item: {},
        owner: {},
        group: {},
        text: "",
        order: 0,
        parent: 0
    }

    static fields = {
        owner: AccountCollection,
        group: GroupCollection
    }

    static fieldConverters = {
        content_item: (input) => modelInstance(FeedContentItemModel, input)
    }

    static resource = 'discussion'

    static manage(instance, form, collections) {
        return manage(
            instance,
            {...form, content_item: {...form.content_item, owner: form.content_item.owner.id}},
            collections
        )
    }
}

class DiscussionCollection extends Collection {

    static Model = DiscussionModel

    static resource = 'discussion'

    async get(id, instance = null) {
        return await get(this, id, instance)
    }

    static create(data) {
        return makeJsonRequest("discussion/", {
            method: "POST",
            body: {
                ...data
            }
        })
            .then(jsonResponse)
            .then((created) => {
                const instance = new DiscussionModel(created)

                console.log(instance)
                return instance
            })
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections, [
            ['owner', collections.accounts.get]
        ])
    }

    static searchDiscussions(params) {
        return fetchAPI(`discussion/`, {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

}

export {DiscussionCollection, DiscussionModel}
