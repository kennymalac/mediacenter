import {Model, Collection} from './Model.js'
import {fetchAPI, jsonResponse} from '../httputil.js'

class FeedContentTypeModel extends Model {
    static initialState = {
        id: '',
        name: '',
        icon: '',
        title: ''
    }
}

export async function makeFeedContentTypeCollection() {
    const values = await FeedContentTypeCollection.fetch()

    return new FeedContentTypeCollection(values.map((ctype) => {
        return { ...ctype, icon: FeedContentTypeCollection.icons[ctype.name], title: FeedContentTypeCollection.typeMapping[ctype.name] }
    }))
}

class FeedContentTypeCollection extends Collection {

    static Model = FeedContentTypeModel

    static typeMapping = {
        img: "Image",
        vid: "Video",
        link: "Link",
        topic: "Topic",
        post: "Post",
        blgpst: "Blog post"
    }

    static icons = {
        img: "ion-md-image",
        vid: "ion-md-videocam",
        link: "ion-ios-link",
        topic: "ion-ios-chatboxes",
        post: "",
        blgpst: "ion-md-text"
    }

    static fetch() {
        return fetchAPI(`feed-content-type/`, {
            method: "GET"
        })
            .then(jsonResponse)
    }
}

export {FeedContentTypeModel, FeedContentTypeCollection}
