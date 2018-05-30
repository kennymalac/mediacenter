import {accounts, interests, stashes, profiles, feedContentTypes} from "../store.js"

export default async function dependencies(stashId) {
    const [owner, stashCollection, contentTypeCollection, profileCollection, interestCollection] = await Promise.all(
        [accounts(), stashes(), feedContentTypes(), profiles(), interests()]
    )
    const stash = await stashCollection.getInstance(stashId)

    return {
        owner,
        content_item: stash.collections.content,
        content_type: contentTypeCollection,
        content_types: contentTypeCollection,
        profile: profileCollection,
        friends: owner,
        account: owner,
        interests: interestCollection
    }
}
