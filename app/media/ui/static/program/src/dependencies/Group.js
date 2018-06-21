import {groups, feeds, interests, stashes, accounts, profiles, comments, feedContentTypes} from '../store.js'

export default async function dependencies() {
    const [groupCollection, members, feed, profile, stashCollection, interestCollection, commentCollection, contentTypes] = await Promise.all(
        [groups(), accounts(), feeds(), profiles(), stashes(), interests(), comments(), feedContentTypes()]
    )

    return {
        members, feed, profile, stashes: stashCollection, interests: interestCollection, content_types: contentTypes, comments: commentCollection, owner: members, friends: members, member_groups: groupCollection, account: accounts
    }
}
