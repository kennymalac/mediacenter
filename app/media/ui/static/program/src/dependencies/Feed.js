import {stashes, interests, places, comments, profiles, accounts, feedContentTypes} from '../store.js'

export default async function dependencies() {
    const [
        interestCollection,
        placeCollection,
        commentCollection,
        stashCollection,
        contentTypeCollection,
        accountCollection,
        profile
    ] = await Promise.all([interests(), places(), comments(), stashes(), feedContentTypes(), accounts(), profiles()])

    return {
        interests: interestCollection,
        places: placeCollection,
        comments: commentCollection,
        stashes: stashCollection,
        content_type: contentTypeCollection,
        content_types: contentTypeCollection,
        owner: accountCollection,
        profile
    }
}
