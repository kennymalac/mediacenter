import {Model, Collection} from './Model.js'
import {InterestCollection} from './Interest.js'
import {fetchAPI, jsonResponse} from '../httputil.js'

class ProfileModel extends Model {

    static initialState = {
        id: 0,
        display_name: "",
        title: "",
        description: "",
        picture: "",
        interests: []
    }

    static fields = {
        interests: InterestCollection
    }
}

export async function makeProfileCollection(queryset, interests) {
    let results = await Promise.all([
        interests(),
        queryset()
    ])

    return new ProfileCollection(results[1], {
        interests: results[0]
    })
}

class ProfileCollection extends Collection {
    static Model = ProfileModel

    static get(id) {
        return fetchAPI(`profile/${id}`, {
            method: "GET"
        })
            .then(jsonResponse)
            .then((data) => {
                return new ProfileModel({...data})
            })
    }

    static all() {
        return fetchAPI(`profile/`, {
            method: "GET"
        })
            .then(jsonResponse)
    }

    static searchProfiles(params) {
        console.log(params)
        return fetchAPI(`profile/`, {
            method: "GET",
            queryParams: params
        })
            .then(jsonResponse)
    }
}

export {ProfileModel, ProfileCollection}
