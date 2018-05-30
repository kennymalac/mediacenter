import {Model, Collection} from './Model.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'
import {getNested, manageNested, paginatedListNested} from './generics.js'

import {momentDate} from './converters.js'

export async function makeCommentCollection() {
    return new CommentCollection([])
}

class CommentModel extends Model {

    static initialState = {
        id: 0,
        content_item: 0,
        owner: {},
        created: {},
        parent: 0,
        text: ""
    }

    static fields = {
        owner: Collection
        // content_item: FeedContentItemCollection
    }

    static fieldConverters = {
        created: momentDate
    }

    static resource = 'comment'

    static manage(instance, form, collections) {
        return manageNested(
            instance,
            form.content_item,
            {...form},
            collections
        )
    }
}

class CommentCollection extends Collection {

    static Model = CommentModel

    static parentResource = 'content'
    static resource = 'comment'

    async get(contentId, id, collections, instance = null) {
        return await getNested(this, contentId, id, instance, collections)
    }

    async create(contentId, form, collections) {
        const data = {...form, owner: form.owner.id, content_item: contentId}

        const created = await makeJsonRequest(`content/${contentId}/comment/`, {
            method: "POST",
            body: data
        })
              .then(jsonResponse)

        const instance = this.addInstance(created, collections)
        instance.sync(created, collections)

        return instance
    }

    async list(contentId, params, collections) {
        return await paginatedListNested(this, contentId, params, collections, [
            ['owner', collections.accounts.get.bind(collections.accounts)]
        ])
    }
}

export {CommentCollection, CommentModel}
