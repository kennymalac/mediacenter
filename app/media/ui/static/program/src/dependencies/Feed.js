import {stashes, interests, profiles, accounts, feedContentTypes} from '../store.js'

export default async function dependencies() {
    const [
        interestCollection,
        stashCollection,
        contentTypeCollection,
        accountCollection,
        profile
    ] = await Promise.all([interests(), stashes(), feedContentTypes(), accounts(), profiles()])

    return {
        interests: interestCollection,
        stashes: stashCollection,
        content_types: contentTypeCollection,
        owner: accountCollection,
        profile
    }
}
