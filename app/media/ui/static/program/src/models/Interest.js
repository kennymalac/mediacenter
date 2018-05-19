import {Model, Collection} from './Model.js'
import {get, paginatedList} from './generics.js'
import {makeJsonRequest, jsonResponse} from '../httputil.js'

export async function makeInterestCollection() {
    return new InterestCollection([])
}

class InterestModel extends Model {

    static initialState = {
        id: 0,
        name: ""
        // parents: {}
        // children: {},
    }

    static resource = 'interest'

    // TODO figure out recursive relations
    // static fields = {
    //     parents: InterestCollection,
    //     children: InterestCollection
    // }
}

class InterestCollection extends Collection {

    static Model = InterestModel

    static resource = 'interest'

    async get(id, collections, instance = null) {
        return await get(this, id, instance)
    }

    static create(data) {
        return makeJsonRequest("interest/", {
            method: "POST",
            body: {
                ...data
            }
        })
            .then(jsonResponse)
            .then((created) => {
                const instance = new InterestModel(created)

                console.log(instance)
                return instance
            })
    }

    async list(params, collections) {
        return await paginatedList(this, 0, collections)
    }

    // searchInterests
}

export {InterestCollection, InterestModel}
