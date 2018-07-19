import {Model, Collection} from './Model.js'
import {get, manage, paginatedList, resolveInstances} from './generics.js'
import {AccountCollection} from './Account.js'

import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'

export async function makeFilteredAlbumCollection(queryset, _accounts, _profiles, _contentTypes) {
    let [owner, profile, contentTypes, values] = await Promise.all(
        [_accounts(), _profiles(), _contentTypes(), queryset()]
    )
    const collection = new AlbumCollection([])

    await resolveInstances(
        collection,
        values,
        {
            profile, content_types: contentTypes, owner, friends: owner
        }
    )

    return collection
}

class AlbumModel extends Model {

    static initialState = {
        id: 0,
        title: '',
        description: '',
        tags: [],
        owner: {}
    }

    static resource = 'album'

    static fields = {
        owner: AccountCollection
    }

    static upload(albumId, form) {
        return fetchAPI(`album/${albumId}/upload/`, {
            method: "POST",
            headers: makeHeaders({}),
            body: form
        })
    }

    static listItems(albumId, currentPage) {
        return fetchAPI(`album/${albumId}/media/?page=${currentPage}`, {
            method: "GET"
        })
            .then(jsonResponse)
    }
}

class AlbumCollection extends Collection {
    // static list()
    static Model = AlbumModel

    static resource = 'album'

    async get(id, instance = null) {
        return await get(this, id, instance)
    }

    create(form, collections) {
        return makeJsonRequest("album/", {
            method: "POST",
            body: {
                ...form
            }
        })
            .then(jsonResponse)
            .then((createdData) => {
                const instance = this.addInstance({
                    ...createdData
                }, collections)

                return instance
            })
    }

    manage(instance, form, collections) {
        return manage(
            this,
            instance,
            {...form},
            collections
        )
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections, [
            ['owner', collections.accounts.get]
        ])
    }

    static searchAlbums() {
        var params = {}

        // Fetches available media
        // if (!this.auth.privilegeLevel === "guest") {
        //     params.accessLevel = "public"
        // }
        // TODO this is an authorized request
        return fetchAPI(`album/`, {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

}

export {AlbumCollection, AlbumModel}
