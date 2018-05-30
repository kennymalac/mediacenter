import {stashes, interests, comments, profiles, accounts, feedContentTypes} from '../store.js'

export default async function dependencies() {
    const [
        interestCollection,
        commentCollection,
        stashCollection,
        contentTypeCollection,
        accountCollection,
        profile
    ] = await Promise.all([interests(), comments(), stashes(), feedContentTypes(), accounts(), profiles()])

    return {
        interests: interestCollection,
        comments: commentCollection,
        stashes: stashCollection,
        content_types: contentTypeCollection,
        owner: accountCollection,
        profile
    }
}
