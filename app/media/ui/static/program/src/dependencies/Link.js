import {accounts, interests, places, comments, stashes, groups, profiles, feedContentTypes} from "../store.js"

export default async function dependencies(stashId) {
    const [owner, stashCollection, contentTypeCollection, groupCollection, profileCollection, interestCollection, placeCollection, commentCollection] = await Promise.all(
        [accounts(), stashes(), feedContentTypes(), groups(), profiles(), interests(), places(), comments()]
    )
    const stash = await stashCollection.getInstance(stashId)

    return {
        owner,
        content_item: stash.collections.content,
        content_type: contentTypeCollection,
        content_types: contentTypeCollection,
        member_groups: groupCollection,
        profile: profileCollection,
        friends: owner,
        account: owner,
        interests: interestCollection,
        places: placeCollection,
        comments: commentCollection
    }
}
