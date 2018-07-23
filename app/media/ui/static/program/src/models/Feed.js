import {momentDate, choice, visibilityChoices} from './converters.js'
import {Model, Collection} from './Model.js'
import {serializeIds} from './serializers.js'
import {get, manage, paginatedList, resolveInstances} from './generics.js'
import {AccountCollection} from './Account'
import {FeedContentTypeCollection} from './FeedContentType'
import {InterestCollection} from './Interest'
import {FeedContentStashCollection} from './FeedContentStash'
import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'
import {FeedContentItemCollection} from './FeedContentItem'

export async function makeFilteredFeedCollection(queryset, deps) {
    const {interests, places, comments, owner, stashes} = deps
    const collection = new FeedCollection([], {
        interests,
        owner,
        stashes,
        content_types: deps.content_types,
        content_type: deps.content_types,
        places,
        comments
    })

    await resolveInstances(
        collection,
        await queryset(),
        deps,
        // stashes: results[2]
        [
            ['interests', interests.get.bind(interests)],
            ['stashes', stashes.get.bind(stashes)]
        ]
    )

    return collection
}

class FeedModel extends Model {

    static fields = {
        content_types: [FeedContentTypeCollection],
        owner: AccountCollection,
        interests: [InterestCollection],
        places: [Collection],
        stashes: [FeedContentStashCollection]
    }

    static fieldConverters = {
        created: momentDate,
        visibility: (input) => choice(input, visibilityChoices)
    }

    static resource = 'feed'

    static initialState = {
        owner: {},
        id: 0,
        created: {},
        name: '',
        description: '',
        stashes: [],
        places: [],
        interests: [],
        rules: [],
        content_types: [],
        visibility: {}
    }

    static listItems(feedId, params, collections, offset = 0) {
        return makeJsonRequest(`content/search/`, {
            method: "POST",
            body: {feed: feedId},
            queryParams: params
        })
            .then(jsonResponse)

            .then((data) => {
                const collection = new FeedContentItemCollection([], collections)
                let order = 0 + offset
                // Returns a list of ContentItem model instances
                return {
                    ...data,
                    results: data.results.map((input) => {
                        const instance = collection.addInstance(input)
                        instance.order = order++
                        collection.sync(instance, input)
                        return instance
                    })
                }
            })
    }
}

class FeedCollection extends Collection {

    static Model = FeedModel

    static resource = 'feed'

    async get(id, collections, instance = null) {
        return await get(this, id, instance, collections)
    }

    create(form, collections) {
        return makeJsonRequest("feed/", {
            method: "POST",
            body: {
                ...form,
                visibility: form.visibility.value,
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

    manage(instance, form, collections) {
        return manage(this, instance, {
            ...form,
            owner: form.owner.id,
            visibility: form.visibility.value,
            content_types: serializeIds(form.content_types),
            stashes: serializeIds(form.stashes),
            interests: serializeIds(form.interests)
        }, collections)
    }

    upload(feedId, form) {
        return fetchAPI(`feed/${feedId}/upload/`, {
            method: "POST",
            headers: makeHeaders({}),
            body: form
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
        return await paginatedList(this, params, collections, [
            ['owner', collections.accounts.get.bind(collections.accounts)],
            ['interests', collections.interests.get.bind(collections.interests)],
            ['stashes', collections.stashes.get.bind(collections.stashes)]
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
