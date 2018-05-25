import {Model, Collection} from './Model.js'
import {AccountCollection} from './Account'
import {FeedContentTypeCollection} from './FeedContentType.js'
import {momentDate} from './converters.js'

class FeedContentItemModel extends Model {

    static initialState = {
        id: 0,
        object_id: 0,
        group_stash_ids: [],
        content_type: {},
        created: {},
        description: "",
        owner: {},
        title: ""
    }

    static fields = {
        owner: AccountCollection,
        content_type: FeedContentTypeCollection
    }

    static fieldConverters = {
        created: momentDate
    }
}

class FeedContentItemCollection extends Collection {

    static Model = FeedContentItemModel
}

export {FeedContentItemModel, FeedContentItemCollection}
