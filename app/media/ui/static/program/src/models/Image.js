import {Model, Collection} from './Model.js'
import {serializeContentItem} from './serializers.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'
import {get, manage, destroy, paginatedList} from './generics.js'
import {FeedContentItemCollection} from './FeedContentItem'
import {FeedContentStashModel} from './FeedContentStash'

export async function makeImageCollection() {
    return new ImageCollection([])
}

class ImageModel extends Model {

    static initialState = {
        id: 0,
        content_item: {},
        src: ""
    }

    static fields = {
        content_item: FeedContentItemCollection
    }

    static resource = 'image'
}

class ImageCollection extends Collection {

    static Model = ImageModel

    static resource = 'image'

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections, [
            [['content_item', 'interests'], collections.interests.get.bind(collections.interests)]
        ])
    }

    async manage(instance, form, collections) {
        const {src} = form
        return manage(
            this,
            instance,
            {src, content_item: serializeContentItem(form)},
            collections
        )
    }

    async create(form, collections) {
        const data = {...form}
        const stash = data.stash
        const feed = data.feed
        delete data.stash
        delete data.feed

        const created = await makeJsonRequest("image/", {
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

    async destroy(instance, collections) {
        return await destroy(this, instance, collections)
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections, [
            ['owner', collections.accounts.get.bind(collections.accounts)]
        ])
    }

    // async searchImages(params, collections) {
    //     return fetchAPI(`image/search`, {
    //         method: "POST",
    //         data: params
    //     })
    //         .then(jsonResponse)

    //         .then((data) => {
    //             return this.addInstances(data, collections)
    //         })
    // }

}

export {ImageCollection, ImageModel}
