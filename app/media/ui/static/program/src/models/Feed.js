import {modelInstance, momentDate} from './converters.js'
import {Model, Collection, serializeIds} from './Model.js'
import {get, manage, paginatedList, resolveInstances} from './generics.js'
import {AccountCollection} from './Account'
import {FeedContentTypeCollection} from './FeedContentType'
import {InterestCollection} from './Interest'
import {FeedContentStashCollection} from './FeedContentStash'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'
import {FeedContentItemModel} from './FeedContentItem'

export async function makeFilteredFeedCollection(queryset, _feedContentTypes, _interests, _accounts) {
    let [contentTypes, interests, owner, values] = await Promise.all(
        [_feedContentTypes(), _interests(), _accounts(), queryset()]
    )

    const collection = new FeedCollection([])

    await resolveInstances(
        collection,
        values,
        { content_types: contentTypes, interests, owner },
        // stashes: results[2]
        [
            ['interests', interests.get]
        ]
    )

    return collection
}

class FeedModel extends Model {

    static fields = {
        content_types: [FeedContentTypeCollection],
        owner: AccountCollection,
        interests: [InterestCollection],
        stashes: [FeedContentStashCollection]
    }

    static fieldConverters = {
        created: momentDate
    }

    static resource = 'feed'

    static initialState = {
        owner: {},
        id: 0,
        created: {},
        name: '',
        description: '',
        stashes: [],
        interests: [],
        rules: [],
        content_types: []
    }

    static manage(instance, form, collections) {
        return manage(instance, {
            ...form,
            content_types: serializeIds(form.content_types),
            interests: serializeIds(form.interests)
        }, collections)
    }

    static upload(feedId, form) {
        return fetchAPI(`feed/${feedId}/upload/`, {
            method: "POST",
            headers: makeHeaders({}),
            body: form
        })
    }

    static listItems(feedId, params) {
        console.log(params)
        return makeJsonRequest(`content/search/`, {
            method: "POST",
            body: {feed: feedId}
        })
            .then(jsonResponse)

            .then((data) => {
                // Returns a list of ContentItem model instances
                return data.results.map((input) => modelInstance(FeedContentItemModel, input))
            })
    }
}

class FeedCollection extends Collection {

    static Model = FeedModel

    static resource = 'feed'

    async get(id, instance = null) {
        return await get(this, id, instance)
    }

    create(form, collections) {
        return makeJsonRequest("feed/", {
            method: "POST",
            body: {
                ...form,
                content_types: serializeIds(form.content_types),
                interests: serializeIds(form.interests)
            }
        })
            .then(jsonResponse)
            .then((createdData) => {
                const instance = this.addInstance({
                    ...createdData, content_types: form.content_types, interests: form.interests
                }, collections)

                return instance
            })
    }

    static all(params = {}) {
        return makeJsonRequest(`feed/`, {
            method: "GET",
            queryParams: params
        })
            .then(jsonResponse)
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections, [
            ['owner', collections.accounts.get],
            ['interests', collections.interests.get]
//            ['stashes', collections.stashes.get]
        ])
    }

    static searchFeeds(params) {
        return fetchAPI(`feed/`, {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

}

export {FeedCollection, FeedModel}
