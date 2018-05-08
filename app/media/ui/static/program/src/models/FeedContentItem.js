import {Model} from './Model.js'
import {momentDate} from './converters.js'

class FeedContentItemModel extends Model {

    static initialState = {
        id: 0,
        content_type: "",
        created: {},
        description: "",
        owner: 0,
        title: ""
    }

    static fieldConverters = {
        created: momentDate
    }
}

export {FeedContentItemModel}
