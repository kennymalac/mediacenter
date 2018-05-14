import {Model, Collection} from './Model.js'
// import {modelInstance} from './converters.js'
import {makeJsonRequest, jsonResponse, fetchAPI} from '../httputil.js'

export function makeInterestCollection() {
    return InterestCollection.all().then((items) => {
        return new InterestCollection(items)
    })
}

class InterestModel extends Model {

    static initialState = {
        id: 0,
        name: ""
        // parents: {}
        // children: {},
    }

    // TODO figure out recursive relations
    // static fields = {
    //     parents: InterestCollection,
    //     children: InterestCollection
    // }
}

class InterestCollection extends Collection {

    static Model = InterestModel

    static get(id) {
        return fetchAPI(`interest/${id}/`, {
            method: "GET"
        })
            .then(jsonResponse)

            .then((data) => {
                const instance = new InterestModel({...data})
                return instance
            })
            .catch((error) => {
                // TODO better error handling
                console.log(error)
            })
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

    static all(params) {
        return fetchAPI(`interest/`, {
            method: "GET",
            data: params
        })
            .then(jsonResponse)

            .then((data) => {
                return data
            })
    }

    // searchInterests
}

export {InterestCollection, InterestModel}
