import {Model, Collection} from './Model.js'
import {serializeContentItem} from './serializers.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'
import {get, manage, paginatedList} from './generics.js'
import {FeedContentItemCollection} from './FeedContentItem'
import {FeedContentStashModel} from './FeedContentStash'

export async function makeLinkCollection() {
    return new LinkCollection([])
}

class LinkModel extends Model {

    static initialState = {
        id: 0,
        content_item: {},
        link: ""
    }

    static fields = {
        content_item: FeedContentItemCollection
    }

    static resource = 'link'
}

class LinkCollection extends Collection {

    static Model = LinkModel

    static resource = 'link'

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections)
    }

    async manage(instance, form, collections) {
        const {link, id} = form
        return manage(
            this,
            instance,
            {link, id, content_item: serializeContentItem(form)},
            collections
        )
    }

    async create(form, collections) {
        const data = {...form}
        const stash = data.stash
        const feed = data.feed
        delete data.stash
        delete data.feed

        const created = await makeJsonRequest("link/", {
            method: "POST",
            body: {
                ...data, content_item: {...data.content_item, owner: data.content_item.owner.id}
            }
        })
              .then(jsonResponse)

        await FeedContentStashModel.addContent(stash, feed, [created.content_item], collections)

        const instance = this.addInstance(created, collections)
        this.sync(instance, created, collections)

        return instance
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections, [
            ['owner', collections.accounts.get.bind(collections.accounts)]
        ])
    }

    async searchLinks(params, collections) {
        return fetchAPI(`link/search`, {
            method: "POST",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return this.addInstances(data, collections)
            })
    }

}

export {LinkCollection, LinkModel}
