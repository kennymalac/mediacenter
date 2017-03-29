import {jsonResponse} from '../httputil.js'

class AlbumCollection {
    static get(id) {
        // TODO verify id is integer (typescript)
        // TODO attach auth headers
        return fetch("/api/album/" + id, {
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

    static searchAlbums() {
        var params = {}

        // Fetches available media
        // if (!this.auth.privilegeLevel === "guest") {
        //     params.accessLevel = "public"
        // }
        // TODO this is an authorized request
        return fetch("/api/album/", {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }
}

export {AlbumCollection}
