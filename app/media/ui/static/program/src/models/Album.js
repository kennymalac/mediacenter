import {makeJsonRequest, makeHeaders, jsonResponse, fetchAPI} from '../httputil.js'

class AlbumCollection {
    // TODO make this a Store
    // static list()
    static get(id) {
        // TODO verify id is integer (typescript)
        // TODO attach auth headers
        return fetchAPI(`album/${id}`, {
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

class AlbumModel {

    static initialState = {
        id: null,
        title: '',
        description: '',
        tags: []
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

export {AlbumCollection, AlbumModel}
