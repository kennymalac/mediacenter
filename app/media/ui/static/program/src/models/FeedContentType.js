import {Model, Collection} from './Model.js'
import {fetchAPI, jsonResponse} from '../httputil.js'

class FeedContentTypeModel extends Model {
    static initialState = {
        id: '',
        name: ''
    }
}

export function makeFeedContentTypeCollection() {
    return FeedContentTypeCollection.fetch().then((data) => {
        return new FeedContentTypeCollection(data)
    })
}

class FeedContentTypeCollection extends Collection {

    static Model = FeedContentTypeModel

    static typeMapping = {
        img: "Image",
        vid: "Video",
        link: "Link",
        topic: "Topic",
        blgpst: "Blog post"
    }

    static fetch() {
        return fetchAPI(`feed-content-type/`, {
            method: "GET"
        })
            .then(jsonResponse)
    }
}

export {FeedContentTypeModel, FeedContentTypeCollection}
