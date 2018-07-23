import {accounts, interests, places, feedContentTypes, comments} from '../store.js'

export default async function dependencies() {
    const [contentTypeCollection, owner, interestCollection, placeCollection, commentCollection] = await Promise.all(
        [feedContentTypes(), accounts(), interests(), places(), comments()]
    )

    return {
        interests: interestCollection,
        places: placeCollection,
        comments: commentCollection,
        content_type: contentTypeCollection,
        owner
    }
}
