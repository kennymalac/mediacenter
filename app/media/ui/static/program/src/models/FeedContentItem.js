import {Model, Collection} from './Model.js'
import {AccountCollection} from './Account'
import {FeedContentTypeCollection} from './FeedContentType.js'
import {momentDate, choice, visibilityChoices} from './converters.js'

class FeedContentItemModel extends Model {

    static initialState = {
        id: 0,
        object_id: 0,
        feed_id: 0,
        origin_stash_id: 0,
        group_id: 0,
        is_anonymous: false,
        interests: [],
        comments: [],
        nested_object: {},
        content_type: {},
        created: {},
        description: "",
        owner: {},
        title: "",
        visibility: {}
    }

    static fields = {
        owner: AccountCollection,
        comments: [Collection],
        interests: [Collection],
        content_type: FeedContentTypeCollection
    }

    static fieldConverters = {
        created: momentDate,
        visibility: (input) => choice(input, visibilityChoices)
    }
}

class FeedContentItemCollection extends Collection {

    static Model = FeedContentItemModel
}

export {FeedContentItemModel, FeedContentItemCollection}
