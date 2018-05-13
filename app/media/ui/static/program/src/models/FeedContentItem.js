import {Model} from './Model.js'
import {AccountModel} from './Account'
import {momentDate, modelInstance} from './converters.js'

class FeedContentItemModel extends Model {

    static initialState = {
        id: 0,
        content_type: "",
        created: {},
        feeds: [],
        description: "",
        owner: {},
        title: ""
    }

    static fieldConverters = {
        created: momentDate,
        owner: (input) => modelInstance(AccountModel, input)
    }
}

export {FeedContentItemModel}
