import {fetchAPI, jsonResponse} from '../httputil.js'

class FeedContentTypeCollection {

    static typeMapping = {
        img: "Image",
        vid: "Video",
        link: "Link",
        topic: "Topic",
        blgpst: "Blog post"
    }

    static all() {
        return fetchAPI(`feed-content-type/`, {
            method: "GET"
        })
            .then(jsonResponse)
    }
}

export {FeedContentTypeCollection}
