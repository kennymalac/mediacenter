import {Model, Collection} from './Model.js'
import {serializeContentItem, serializeIds} from './serializers.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'
import {get, manage, paginatedList} from './generics.js'
import {FeedContentItemCollection} from './FeedContentItem'
import {FeedContentStashModel} from './FeedContentStash'
import {momentDate} from './converters.js'
// import {AccountCollection} from './Account'
// import {GroupCollection} from './Group'

export async function makeDiscussionCollection() {
    return new DiscussionCollection([])
}

class DiscussionModel extends Model {

    static initialState = {
        id: 0,
        content_item: {},
        text: "",
        order: 0,
        parent: 0,
        text_last_edited: {},
        edited: false,
        poll: null
    }

    static fields = {
        content_item: FeedContentItemCollection
    }

    static fieldConverters = {
        text_last_edited: momentDate
    }

    static resource = 'discussion'
}

class DiscussionCollection extends Collection {

    static Model = DiscussionModel

    static resource = 'discussion'

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections)
    }

    async create(form, collections) {
        const data = {...form}
        const stash = data.stash
        const feed = data.feed
        delete data.stash
        delete data.feed

        const created = await makeJsonRequest("discussion/", {
            method: "POST",
            body: {
                ...data, content_item: {...data.content_item, interests: serializeIds(data.content_item.interests), owner: data.content_item.owner.id}
            }
        })
              .then(jsonResponse)

        if (!data.parent) {
            // TODO replies can be stored on specific stashes
            // via pubsub
            await FeedContentStashModel.addContent(stash, feed, [created.content_item], collections)
        }
        const instance = this.addInstance(created, collections)
        this.sync(instance, created, collections)

        return instance
    }

    async manage(instance, form, collections) {
        return manage(
            this,
            instance,
            {...form, content_item: serializeContentItem(form)},
            collections
        )
    }

    async list(params, collections) {
        return await paginatedList(this, params, collections)
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
