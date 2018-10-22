import {Model, Collection} from './Model.js'
import {serializeContentItem, serializeIds} from './serializers.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'
import {get, manage, destroy, paginatedList} from './generics.js'
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
        console.log('data', data)
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

        // TODO replies can be stored on specific stashes
        // via pubsub
        await FeedContentStashModel.addContent(stash, feed, [created.content_item], collections)
        const instance = this.addInstance(created, collections)
        this.sync(instance, created, collections)

        return instance
    }

    async manage(instance, form, collections) {
        if (form.poll) {
            const options = form.poll.options.map((option) => {
                if (option.id !== undefined && option.value === undefined) {
                    delete option.id
                    return option
                }
                return option
            })
            form.poll = { ...form.poll, options }
        }
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

    async votePoll(instance, choice, collections) {
        // TODO multiple choices
        // const options = instance.options.filter((option) => {
        //     return option.id !== choice.id
        // })
        const newOptions = await makeJsonRequest(`discussion/${instance.id}/vote/`, {
            method: "POST",
            body: {
                options: [choice]
            }
        })
              .then(jsonResponse)

        this.sync(instance, {poll: newOptions}, collections)
    }

    async destroy(instance, collections) {
        return await destroy(this, instance, collections)
    }
}

export {DiscussionCollection, DiscussionModel}
