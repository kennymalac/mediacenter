import {Model, Collection} from './Model.js'
import {modelInstance} from './converters.js'
import {AccountModel} from './Account.js'

import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'

export async function makeAlbumCollection() {
    let albums = await AlbumCollection.searchAlbums()
    return new AlbumCollection(albums)
}

class AlbumModel extends Model {

    static initialState = {
        id: 0,
        title: '',
        description: '',
        tags: [],
        owner: {}
    }

    static fieldConverters = {
        owner: (input) => modelInstance(AccountModel, input)
    }

    // TODO make this a Store
    static manage(album) {
        return makeJsonRequest(`album/${album.id}/`, {
            method: "PUT",
            body: {
                ...album
            }
        })
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

    static get(id) {
        // TODO verify id is integer (typescript)
        // TODO attach auth headers
        return fetchAPI(`album/${id}/`, {
            method: "GET"
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
            .catch((error) => {
                // TODO better error handling
                console.log(error)
            })
    }

    static create(data) {
        return makeJsonRequest("album/", {
            method: "POST",
            body: {
                ...data
            }
        })
            .then(jsonResponse)
            .then((createdData) => {
                const instance = new AlbumModel(createdData)

                console.log(instance)
                return instance
            })
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
