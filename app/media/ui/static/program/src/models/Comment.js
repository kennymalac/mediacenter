import {Model, Collection} from './Model.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'
import {getNested, manageNested, paginatedListNested} from './generics.js'

import {momentDate} from './converters.js'

export async function makeCommentCollection() {
    return new CommentCollection([])
}

export async function makeProfileCommentCollection() {
    return new ProfileCommentCollection([])
}

class CommentModel extends Model {

    static initialState = {
        id: 0,
        content_item: 0,
        user_profile: 0,
        owner: {},
        is_anonymous: false,
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

    static parentResource = 'content'
    static resource = 'comment'
}

class ProfileCommentModel extends CommentModel {
    static parentResource = 'profile'
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

        const created = await makeJsonRequest(`${this.constructor.parentResource}/${contentId}/comment/`, {
            method: "POST",
            body: data
        })
              .then(jsonResponse)

        const instance = this.addInstance(created, collections)
        this.sync(instance, created, collections)

        return instance
    }

    async manage(instance, form, collections) {
        return manageNested(
            this,
            instance,
            instance.content_item,
            {...form, owner: form.owner.id},
            collections
        )
    }

    async list(contentId, params, collections) {
        return await paginatedListNested(this, contentId, params, collections)
    }
}

class ProfileCommentCollection extends CommentCollection {
    static Model = ProfileCommentModel
    static parentResource = 'profile'

    async create(profileId, form, collections) {
        const data = {...form, owner: form.owner.id, user_profile: profileId}

        const created = await makeJsonRequest(`${this.constructor.parentResource}/${profileId}/comment/`, {
            method: "POST",
            body: data
        })
              .then(jsonResponse)

        const instance = this.addInstance(created, collections)
        this.sync(instance, created, collections)

        return instance
    }

    async manage(instance, form, collections) {
        return manageNested(
            this,
            instance,
            instance.user_profile,
            {...form, owner: form.owner.id},
            collections
        )
    }
}

export {CommentCollection, CommentModel, ProfileCommentCollection, ProfileCommentModel}
