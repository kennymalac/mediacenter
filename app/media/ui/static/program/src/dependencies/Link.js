import {accounts, interests, comments, stashes, groups, profiles, feedContentTypes} from "../store.js"

export default async function dependencies(stashId) {
    const [owner, stashCollection, contentTypeCollection, groupCollection, profileCollection, interestCollection, commentCollection] = await Promise.all(
        [accounts(), stashes(), feedContentTypes(), groups(), profiles(), interests(), comments()]
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
        comments: commentCollection
    }
}
